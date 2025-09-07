import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

interface TableContextProps {
  variant?: "default" | "neutral" | "striped" | "ghost";
}

const TableContext = React.createContext<TableContextProps>({
  variant: "default",
});

// --- Main Table Component ---
const tableVariants = cva(
  "relative w-full overflow-hidden rounded-base border-2 border-border",
  {
    variants: {
      variant: {
        default: "shadow-shadow",
        neutral: "shadow-shadow",
        striped: "shadow-shadow",
        ghost: "", // No shadow for the ghost variant
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface TableProps
  extends React.ComponentProps<"table">,
    VariantProps<typeof tableVariants> {}

function Table({ className, variant, ...props }: TableProps) {
  const tableVariant = variant ?? "default";
  return (
    <TableContext.Provider value={{ variant: tableVariant }}>
      <div className={cn(tableVariants({ variant: tableVariant }))}>
        <div className="overflow-auto">
          <table
            data-slot="table"
            className={cn("w-full caption-bottom text-sm", className)}
            {...props}
          />
        </div>
      </div>
    </TableContext.Provider>
  );
}

// --- Table Header ---
const tableHeaderVariants = cva("[&_tr]:border-b-2 [&_tr]:border-border", {
  variants: {
    variant: {
      default: "bg-main text-main-foreground",
      neutral: "bg-secondary-background text-foreground",
      striped: "bg-secondary-background text-foreground",
      ghost: "bg-transparent text-foreground",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  const { variant } = React.useContext(TableContext);
  return (
    <thead
      data-slot="table-header"
      className={cn(tableHeaderVariants({ variant }), className)}
      {...props}
    />
  );
}

// --- Table Body ---
function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return (
    <tbody
      data-slot="table-body"
      className={cn("[&_tr:last-child]:border-0", className)}
      {...props}
    />
  );
}

// --- Table Footer ---
const tableFooterVariants = cva(
  "border-t-2 border-border font-base last:[&>tr]:border-b-0",
  {
    variants: {
      variant: {
        default: "bg-main text-main-foreground",
        neutral: "bg-secondary-background text-foreground",
        striped: "bg-secondary-background text-foreground",
        ghost: "bg-transparent text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  const { variant } = React.useContext(TableContext);
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(tableFooterVariants({ variant }), className)}
      {...props}
    />
  );
}

// --- Table Row ---
const tableRowVariants = cva(
  "border-b-2 border-border transition-colors font-base data-[state=selected]:bg-border",
  {
    variants: {
      variant: {
        default: "bg-main text-main-foreground",
        neutral: "bg-background hover:bg-secondary-background text-foreground",
        striped:
          "odd:bg-secondary-background even:bg-background hover:bg-main/20 text-foreground",
        ghost: "bg-transparent hover:bg-secondary-background text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  const { variant } = React.useContext(TableContext);
  return (
    <tr
      data-slot="table-row"
      className={cn(tableRowVariants({ variant }), className)}
      {...props}
    />
  );
}

// --- Table Head ---
function TableHead({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        "h-12 px-4 text-left align-middle font-heading [&:has([role=checkbox])]:pr-0",
        className
      )}
      {...props}
    />
  );
}

// --- Table Cell ---
function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        "p-4 align-middle [&:has([role=checkbox])]:pr-0",
        className
      )}
      {...props}
    />
  );
}

// --- Table Caption ---
function TableCaption({
  className,
  ...props
}: React.ComponentProps<"caption">) {
  return (
    <caption
      data-slot="table-caption"
      className={cn("mt-4 text-sm text-foreground font-base", className)}
      {...props}
    />
  );
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
};
