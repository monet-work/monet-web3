import ListingForm from "@/components/forms/listing-form";
import ListingContainer from "@/components/listing-container";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";

const ListingsPage: React.FC = () => {
  return (
    <main className="bg-black min-h-screen py-8">
      <div className="container">
        {/* Show public listings */}
        <section>
          <h3 className="text-2xl md:text-4xl text-white">Public Listings</h3>

          <ListingContainer listings={[]} />
        </section>

        {/* Show user listings */}
        <section>
          <h3 className="text-2xl md:text-4xl text-white">My Listings</h3>

          <ListingContainer listings={[]} />

          <div className="mt-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant={"outline"}>Create a listing</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Listing</DialogTitle>
                </DialogHeader>
                <div>
                  <ListingForm />
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </section>
      </div>
    </main>
  );
};

export default ListingsPage;
