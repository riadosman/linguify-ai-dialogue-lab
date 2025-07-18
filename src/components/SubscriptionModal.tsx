
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, X } from "lucide-react";

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubscribe: () => void;
}

export const SubscriptionModal = ({ isOpen, onClose, onSubscribe }: SubscriptionModalProps) => {
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "yearly">("monthly");

  const plans = {
    monthly: {
      price: "$9.99",
      period: "per month",
      savings: null
    },
    yearly: {
      price: "$99.99",
      period: "per year", 
      savings: "Save 17%"
    }
  };

  const features = [
    "Unlimited conversations",
    "Advanced vocabulary hints",
    "Pronunciation guides",
    "Progress tracking",
    "Cultural context tips",
    "Priority support",
    "Offline mode",
    "Custom learning paths"
  ];

  const handleSubscribe = () => {
    // Here you would integrate with your payment processor
    console.log("Subscribing to", selectedPlan, "plan");
    onSubscribe();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-yellow-500" />
            Upgrade to Premium
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Plan Selection */}
          <div className="space-y-3">
            <h3 className="font-medium text-gray-900">Choose your plan</h3>
            <div className="space-y-2">
              {Object.entries(plans).map(([key, plan]) => (
                <Card
                  key={key}
                  className={`p-4 cursor-pointer transition-all ${
                    selectedPlan === key
                      ? "ring-2 ring-indigo-500 bg-indigo-50"
                      : "hover:bg-gray-50"
                  }`}
                  onClick={() => setSelectedPlan(key as "monthly" | "yearly")}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full border-2 ${
                        selectedPlan === key
                          ? "border-indigo-500 bg-indigo-500"
                          : "border-gray-300"
                      }`}>
                        {selectedPlan === key && (
                          <Check className="h-2 w-2 text-white m-0.5" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 capitalize">{key}</p>
                        <p className="text-sm text-gray-600">{plan.price} {plan.period}</p>
                      </div>
                    </div>
                    {plan.savings && (
                      <Badge className="bg-green-100 text-green-700">
                        {plan.savings}
                      </Badge>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Features */}
          <div className="space-y-3">
            <h3 className="font-medium text-gray-900">Premium Features</h3>
            <div className="space-y-2">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-gray-600">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1">
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button 
              onClick={handleSubscribe}
              className="flex-1 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white border-0"
            >
              <Crown className="h-4 w-4 mr-2" />
              Subscribe
            </Button>
          </div>

          <p className="text-xs text-gray-500 text-center">
            Cancel anytime. No long-term commitments.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
