"use client";

import Image from "next/image";
import Link from "next/link";
import {
  File,
  Home,
  LineChart,
  ListFilter,
  MoreHorizontal,
  Package,
  Package2,
  PanelLeft,
  PlusCircle,
  Search,
  Settings,
  ShoppingCart,
  Users2,
  ArrowDownRightSquareIcon,
  ListIcon,
  GridIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState } from "react";
import GridViewComponent from "./grid-view-component";
import TradeListComponent from "./trade-list-table";
import { pointsTableData } from "@/data";

type Props = {};

const TradesView: React.FC<Props> = () => {
  const [isGridActive, setIsGridActive] = useState(false);
  return (
    <div className="bg-muted/40 w-full grow p-4">
      <Tabs defaultValue="list">
        <div className="flex items-center">
          <TabsList>
            <TabsTrigger onClick={() => setIsGridActive(false)} value="list">
              {" "}
              <ListIcon />
            </TabsTrigger>
            <TabsTrigger onClick={() => setIsGridActive(true)} value="grid">
              <GridIcon />
            </TabsTrigger>
          </TabsList>

          <div className="ml-auto flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className=" gap-1">
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Fill Type
                  </span>
                  <ArrowDownRightSquareIcon className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Fill Type</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem checked>All</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>
                  Partial Fill
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Full Fill</DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <TabsContent value="list">
          <Card className="w-full">
            <CardContent className="flex flex-col md:flex-row gap-4">
              <TradeListComponent Points={pointsTableData} isLoading={false} />
              <TradeListComponent Points={pointsTableData} isLoading={false} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="grid">
          <Tabs defaultValue="All">
            {isGridActive && (
              <TabsList className="duration-200 transition">
                <TabsTrigger defaultChecked value="All">
                  {" "}
                  <div>All</div>
                </TabsTrigger>
                <TabsTrigger value="Buy">
                  <div>Buy</div>
                </TabsTrigger>
                <TabsTrigger value="Sell">
                  <div>Sell</div>
                </TabsTrigger>
              </TabsList>
            )}
            <TabsContent value="All">
              <GridViewComponent />
            </TabsContent>
            <TabsContent value="Buy">Buy</TabsContent>
          </Tabs>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TradesView;
