"use client";
import { TitleDescriptionBox } from "@/components/global/Layouts/title-description-box";
import { Slider } from "@/components/ui/slider";
import { api } from "@/trpc/react";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createCheckoutSession } from "@/libs/stripe.libs";

const BillingPage = () => {
  const { data: userCredits, isLoading } =
    api.project.getUserCredits.useQuery();

  const [creditsToBuy, setCreditsToBuy] = useState<number[]>([100]);

  const creditsToBuyAmount = creditsToBuy[0];
  const price = Math.round(creditsToBuyAmount! / 50).toFixed(2);

  const handlePurchase = async () => {
    if (creditsToBuyAmount) {
      await createCheckoutSession(creditsToBuyAmount);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 lg:px-8 xl:px-12">
      <div className="mx-auto max-w-6xl">
        <TitleDescriptionBox
          variant="primary"
          title="Billing"
          description="Purchase credits to unlock the full potential of GitFlow. Credits are used for AI-powered features like code summaries and commit messages."
        />

        <div className="mt-8 grid gap-8 md:grid-cols-2">
          {/* Current Credits Card with Info */}
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Current Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start justify-start">
                <div>
                  <span className="text-4xl font-bold">
                    {isLoading ? "..." : userCredits?.credits || 0}
                  </span>
                  <p className="mt-2 text-muted-foreground">Available Credits</p>
                </div>
              </div>
              
              <div className="mt-6 rounded-lg bg-blue-50 p-4 dark:bg-blue-900/30">
                <h3 className="mb-2 flex items-center text-blue-800 dark:text-blue-300 font-semibold">
                  <svg
                    className="mr-2 h-5 w-5 flex-shrink-0"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Credit Usage Info
                </h3>
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  Each credit allows you to index 1 file in your repository. For
                  example, if your repository has 100 files, you will need 100
                  credits to index it completely.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Purchase Section */}
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Purchase Credits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <div className="mb-2 flex justify-between">
                  <span className="font-medium">Select amount:</span>
                  <span className="font-bold">{creditsToBuyAmount} credits</span>
                </div>
                <Slider
                  defaultValue={[100]}
                  max={1000}
                  step={50}
                  onValueChange={(value) => setCreditsToBuy(value)}
                  className="py-4"
                />
                <div className="mt-2 flex justify-between text-sm">
                  <span>100</span>
                  <span>500</span>
                  <span>1000</span>
                </div>
              </div>

              <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Price:</span>
                  <span className="font-bold">${price}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={handlePurchase}
                className="w-full"
                size="lg"
                disabled={isLoading || !creditsToBuyAmount}
              >
                Purchase {creditsToBuyAmount} Credits for ${price}
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Billing History</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Your purchase history will appear here.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BillingPage;
