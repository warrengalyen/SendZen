import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const campaignsRouter = createTRPCRouter({
  getCampaigns: protectedProcedure.query(async ({ ctx }) => {
    try {
      return await ctx.prisma.campaign.findMany({
        orderBy: [
          {
            updatedAt: "desc",
          },
        ],
        where: {
          userId: ctx.session.user.id,
        },
        select: {
          id: true,
          name: true,
          subject: true,
          hasSent: true,
          scheduledSend: true,
          updatedAt: true,
          list: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
    } catch (err) {
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
    }
  }),
  createCampaign: protectedProcedure
    .input(
      z.object({
        campaignName: z.string(),
        emailSubject: z.string(),
        fromName: z.string(),
        listId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.campaign.create({
          data: {
            name: input.campaignName,
            subject: input.emailSubject,
            sendFromName: input.fromName,
            user: {
              connect: {
                id: ctx.session.user.id,
              },
            },
            list: {
              connect: {
                id: input.listId,
              },
            },
          },
        });
      } catch (err) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
    }),
  getCampaignInfo: protectedProcedure
    .input(z.object({ campaignId: z.string().nullish() }))
    .query(async ({ ctx, input }) => {
      if (!input || !input.campaignId) return null;
      try {
        return await ctx.prisma.campaign.findUnique({
          where: {
            id: input.campaignId,
          },
          select: {
            id: true,
            name: true,
            subject: true,
            sendFromName: true,
            createdAt: true,
            updatedAt: true,
            blocks: true,
            globalStyles: true,
            hasSent: true,
            scheduledSend: true,
            list: {
              select: {
                id: true,
                name: true,
                _count: {
                  select: {
                    contacts: true,
                  },
                },
              },
            },
          },
        });
      } catch (err) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
    }),
  updateCampaign: protectedProcedure
    .input(
      z.object({
        campaignId: z.string(),
        emailSubject: z.string(),
        sendFromName: z.string(),
        listId: z.string(),
        campaignName: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const isUserAuthorisedToEditCampaign = async () => {
          const campaign = await ctx.prisma.campaign.findUnique({
            where: {
              id: input.campaignId,
            },
          });
          if (campaign?.userId !== ctx.session.user.id) {
            throw new TRPCError({ code: "UNAUTHORIZED" });
          } else {
            return true;
          }
        };
        await isUserAuthorisedToEditCampaign();
        return await ctx.prisma.campaign.update({
          where: {
            id: input.campaignId,
          },
          data: {
            name: input.campaignName,
            subject: input.emailSubject,
            sendFromName: input.sendFromName,
            list: {
              connect: {
                id: input.listId,
              },
            },
          },
        });
      } catch (err) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
    }),
  updateCampaignBlocks: protectedProcedure
    .input(
      z.object({
        campaignId: z.string(),
        blocks: z.string(),
        globalStyles: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const isUserAuthorisedToEditCampaign = async () => {
          const campaign = await ctx.prisma.campaign.findUnique({
            where: {
              id: input.campaignId,
            },
          });
          if (campaign?.userId !== ctx.session.user.id) {
            throw new TRPCError({ code: "UNAUTHORIZED" });
          } else {
            return true;
          }
        };
        await isUserAuthorisedToEditCampaign();
        return await ctx.prisma.campaign.update({
          where: {
            id: input.campaignId,
          },
          data: {
            blocks: input.blocks,
            globalStyles: input.globalStyles,
          },
        });
      } catch (err) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
    }),
  getCampaignEditorInfo: protectedProcedure
    .input(z.object({ campaignId: z.string().nullish() }))
    .query(async ({ ctx, input }) => {
      if (!input || !input.campaignId) return null;
      try {
        const isUserAuthorisedToEditCampaign = async () => {
          const campaign = await ctx.prisma.campaign.findUnique({
            where: {
              id: input.campaignId as string,
            },
          });
          if (campaign?.userId !== ctx.session.user.id) {
            throw new TRPCError({ code: "UNAUTHORIZED" });
          } else {
            return true;
          }
        };
        await isUserAuthorisedToEditCampaign();
        return await ctx.prisma.campaign.findUnique({
          where: {
            id: input.campaignId,
          },
          select: {
            id: true,
            name: true,
            blocks: true,
            globalStyles: true,
            subject: true,
            sendFromName: true,
          },
        });
      } catch (err) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
    }),
  deleteCampaigns: protectedProcedure
    .input(z.object({ campaignIds: z.array(z.string()) }))
    .mutation(async ({ ctx, input }) => {
      try {
        const isUserAuthorisedToDeleteCampaigns = async () => {
          const campaigns = await ctx.prisma.campaign.findMany({
            where: {
              id: {
                in: input.campaignIds,
              },
            },
          });
          if (campaigns.some((c) => c.userId !== ctx.session.user.id)) {
            throw new TRPCError({ code: "UNAUTHORIZED" });
          } else {
            return true;
          }
        };
        await isUserAuthorisedToDeleteCampaigns();
        return await ctx.prisma.campaign.deleteMany({
          where: {
            id: {
              in: input.campaignIds,
            },
            hasSent: false,
            scheduledSend: null,
          },
        });
      } catch (err) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
    }),
  scheduleCampaign: protectedProcedure
    .input(
      z.object({
        scheduledSend: z.date().nullish(),
        campaignId: z.string(),
        unschedule: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        if (
          !input.unschedule &&
          (!input.scheduledSend || !(input.scheduledSend instanceof Date))
        )
          throw new TRPCError({ code: "BAD_REQUEST" });
        const campaignNotSend = await ctx.prisma.campaign.findUnique({
          where: {
            id: input.campaignId,
          },
          select: {
            hasSent: true,
          },
        });

        if (campaignNotSend?.hasSent)
          throw new TRPCError({ code: "BAD_REQUEST" });

        return await ctx.prisma.campaign.update({
          where: {
            id: input.campaignId,
          },
          data: {
            scheduledSend: input.unschedule ? null : input.scheduledSend,
          },
        });
      } catch (err) {
        console.log(err);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
    }),
  getSentCampaignCount: protectedProcedure.query(async ({ ctx }) => {
    try {
      return await ctx.prisma.campaign.count({
        where: {
          userId: ctx.session.user.id,
          hasSent: true,
        },
      });
    } catch (err) {
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
    }
  }),
});
