"use client";

import { usePathname } from 'next/navigation';
import React, { Fragment, useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';

const Breadcrumb = ({ children, ...props }: React.ComponentProps<"nav">) => {
  return (
    <nav
      aria-label="breadcrumb"
      className="flex items-center text-sm text-gray-500"
      {...props}
    >
      {children}
    </nav>
  );
};

const BreadcrumbList = ({ children, ...props }: React.ComponentProps<"ol">) => {
  return (
    <ol className="flex items-center gap-2" {...props}>
      {children}
    </ol>
  );
};

const BreadcrumbItem = ({ children, ...props }: React.ComponentProps<"li">) => {
  return <li className="flex items-center gap-2" {...props}>{children}</li>;
};

const BreadcrumbLink = ({ 
  href, 
  children, 
  ...props 
}: React.ComponentProps<"a"> & { href: string }) => {
  return (
    <Link 
      href={href}
      className="hover:text-gray-900 transition-colors"
      {...props}
    >
      {children}
    </Link>
  );
};

const BreadcrumbSeparator = () => {
  return <ChevronRight className="h-4 w-4 text-gray-400" />;
};

function BreadcrumbSegment({ segment, href, isLast }: { 
  segment: string, 
  href: string, 
  isLast: boolean 
}) {
  const [title, setTitle] = useState<string>(segment);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDocumentTitle = async () => {
      // Only fetch if the segment looks like a document ID
      if (segment.length >= 20) {  // Assuming Firebase IDs are long strings
        setLoading(true);
        try {
          const docRef = doc(db, "documents", segment);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists() && docSnap.data()?.title) {
            setTitle(docSnap.data().title);
          }
        } catch (error) {
          console.error("Error fetching document title:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchDocumentTitle();
  }, [segment]);

  if (loading) {
    return <span className="text-gray-400">Loading...</span>;
  }

  if (isLast) {
    return <span className="font-medium text-gray-900">{title}</span>;
  }

  return <BreadcrumbLink href={href}>{title}</BreadcrumbLink>;
}

function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter((segment) => segment !== "");

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">
            <Home className="h-4 w-4" />
          </BreadcrumbLink>
        </BreadcrumbItem>

        {segments.map((segment, index) => {
          const href = `/${segments.slice(0, index + 1).join("/")}`;
          const isLast = index === segments.length - 1;

          return (
            <Fragment key={segment}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbSegment 
                  segment={segment}
                  href={href}
                  isLast={isLast}
                />
              </BreadcrumbItem>
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

export default Breadcrumbs;