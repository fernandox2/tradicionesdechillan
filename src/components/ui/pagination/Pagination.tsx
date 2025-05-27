"use client";

import { generatePaginationNumbers } from "@/utils";
import clsx from "clsx";
import Link from "next/link";
import { redirect, usePathname, useSearchParams } from "next/navigation";
import React from "react";
import { IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5";

interface Props {
  totalPages: number;
  className?: string;
}

export const Pagination = ({ totalPages, className }: Props) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const pageString = searchParams.get("page") ?? 1;
  let currentPage = isNaN( +pageString) ? 1 : +pageString;

  if(currentPage < 1 || isNaN(+pageString)) redirect(pathname);

  const allPages = generatePaginationNumbers(currentPage, totalPages);

  const prevPageUrl = () => {
    const params = new URLSearchParams(searchParams);
    const prevPageNumber = currentPage - 1;
    params.set("page", String(prevPageNumber < 1 ? 1 : prevPageNumber));
    return `${pathname}?${params.toString()}`;
};

const nextPageUrl = () => {
    const params = new URLSearchParams(searchParams);
    const nextPageNumber = currentPage + 1;
    params.set("page", String(nextPageNumber > totalPages ? totalPages : nextPageNumber));
    return `${pathname}?${params.toString()}`;
};

const createPageUrlForPageNumber = (pageNumber: number | string) => {
  const params = new URLSearchParams(searchParams);
  if (typeof pageNumber === "string" && pageNumber === "...") {
    return "#"; 
  }

  let targetPage = Number(pageNumber);

  if (targetPage < 1) targetPage = 1;
  if (targetPage > totalPages) targetPage = totalPages;
  
  params.set("page", String(targetPage));
  return `${pathname}?${params.toString()}`;
};

  return (
   
    <div className={`${className} flex items-center justify-end bg-white`}>
     
      <div>
        <nav
          className="isolate inline-flex -space-x-px rounded-md shadow-sm"
          aria-label="Pagination"
        >
          <Link
            href={prevPageUrl()}
            className={clsx(
              "relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 dark:ring-gray-300 dark:text-gray-300 dark:hover:bg-gray-100",
              {
                "pointer-events-none opacity-60": currentPage <= 1,
              }
            )}
            aria-disabled={currentPage <= 1}
            tabIndex={currentPage <= 1 ? -1 : undefined}
          >
            <span className="sr-only">Previous</span>
            <IoChevronBackOutline className="h-5 w-5" aria-hidden="true" />
          </Link>

          {allPages.map((page, index) => {
            if (page === "...") {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0 dark:ring-gray-600 dark:text-gray-400"
                >
                  ...
                </span>
              );
            }

            const isCurrent = page === currentPage;
            return (
              <Link
                key={page}
                href={createPageUrlForPageNumber(page)}
                aria-current={isCurrent ? "page" : undefined}
                className={clsx(
                  "relative inline-flex items-center px-4 py-2 text-sm font-semibold focus:z-20 focus:outline-offset-0",
                  {
                    "z-10 bg-orange-650 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:bg-orange-650":
                      isCurrent,
                    "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:text-gray-500 dark:ring-gray-300 dark:hover:bg-gray-100":
                      !isCurrent,
                  }
                )}
              >
                {page}
              </Link>
            );
          })}

          <Link
            href={nextPageUrl()}
            className={clsx(
              "relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 dark:ring-gray-300 dark:text-gray-300 dark:hover:bg-gray-100",
              {
                "pointer-events-none opacity-60": currentPage >= totalPages,
              }
            )}
            aria-disabled={currentPage >= totalPages}
            tabIndex={currentPage >= totalPages ? -1 : undefined}
          >
            <span className="sr-only">Next</span>
            <IoChevronForwardOutline className="h-5 w-5" aria-hidden="true" />
          </Link>
        </nav>
      </div>
    </div>
  );
};

