import { type Dispatch, Fragment, type PropsWithChildren, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";

export default function Modal({
  children,
  buttonCancelText,
  buttonActionText,
  heading,
  actionType,
  actionOnClick,
  open,
  setOpen,
}: PropsWithChildren<{
  buttonCancelText: string;
  buttonActionText: string | null;
  heading?: string;
  actionType: "success" | "danger";
  actionOnClick: any;
  open: boolean;
  setOpen: Dispatch<React.SetStateAction<boolean>>;
}>) {
  const cancelButtonRef = useRef(null);

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        initialFocus={cancelButtonRef}
        onClose={setOpen}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    {/* <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                              <ExclamationTriangleIcon
                                                className="h-6 w-6 text-red-600"
                                                aria-hidden="true"
                                              />
                                            </div> */}
                    <div className="mt-3 w-full text-center sm:ml-4 sm:mt-0 sm:text-left">
                      {heading && (
                        <Dialog.Title
                          as="h3"
                          className="mb-6 text-xl font-semibold leading-6 text-gray-900"
                        >
                          {heading}
                        </Dialog.Title>
                      )}
                      <div className="mt-2">{children}</div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-4 sm:flex sm:flex-row-reverse sm:px-6">
                  {buttonActionText && (
                    <button
                      type="button"
                      className={`${
                        actionType === "danger"
                          ? "bg-red-600 hover:bg-red-700 focus:ring-red-500"
                          : "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
                      } mr-5 inline-flex w-full justify-center rounded-md border border-transparent px-4 py-2 text-base font-medium text-white  shadow-sm focus:outline-none  focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm`}
                      onClick={actionOnClick}
                    >
                      {buttonActionText}
                    </button>
                  )}
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:ml-3 sm:mt-0 sm:w-auto sm:text-sm"
                    onClick={() => setOpen(false)}
                    ref={cancelButtonRef}
                  >
                    {buttonCancelText}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
