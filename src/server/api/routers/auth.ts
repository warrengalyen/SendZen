import { TRPCError } from "@trpc/server";
import bcrypt from "bcrypt";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const authRouter = createTRPCRouter({
  createAccount: publicProcedure
    .input(
      z.object({
        firstName: z.string(),
        lastName: z.string(),
        email: z.string(),
        password: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return null; // disables account creation
      const hashedPassword = bcrypt.hashSync(input.password, 10);
      return await ctx.prisma.user
        .create({
          data: {
            first_name: input.firstName,
            last_name: input.lastName,
            email: input.email,
            password: hashedPassword,
            send_from_name: input.firstName + " " + input.lastName,
          },
        })
        .then(() => true)
        .catch(() => new TRPCError({ code: "INTERNAL_SERVER_ERROR" }));
    }),
});
