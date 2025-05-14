import Image from "next/image";
import toast from "react-hot-toast";

export const Mensaje = (
  message: string,
  type: "success" | "error",
  options?: { title?: string; avatarUrl?: string }
) => {
  toast.custom(
    (t) => (
      <div
        className={`${
          t.visible ? "animate-enter" : "animate-leave"
        } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
      >
        <div className="flex-1 w-0 p-4">
          <div className="flex items-start">
            {options?.avatarUrl ? (
              <div className="flex-shrink-0 flex items-center justify-center h-20 w-20">
                <Image
                  unoptimized
                  src={options.avatarUrl}
                  alt="Error Icon"
                  width={80}
                  height={80}
                  className="mx-auto"
                />
              </div>
            ) : (
              <div className="flex-shrink-0 flex items-center justify-center h-20 w-20">
                {type === "success" ? (
                  <Image
                    unoptimized
                    src="/gif/success.gif"
                    alt="Error Icon"
                    width={80}
                    height={80}
                    className="mx-auto"
                  />
                ) : (
                  <Image
                    unoptimized
                    src="/gif/error.gif"
                    alt="Error Icon"
                    width={80}
                    height={80}
                    className="mx-auto"
                  />
                )}
              </div>
            )}
            <div className="ml-3 flex-1 py-2">
              <p className="font-bold text-gray-900">
                {options?.title || (type === "success" ? "Operación Exitosa" : "Error")}
              </p>
              <p className="mt-1 text-sm text-gray-500">{message}</p>
            </div>
          </div>
        </div>
        <div className="flex border-l border-gray-200">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="w-full cursor-pointer border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            aria-label="Cerrar"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    ),
    {
      duration: 5000,
      position: "top-right",
    }
  );
};