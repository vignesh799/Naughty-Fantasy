import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { Review } from "@/types/product";

export function ReviewCards({ reviews }: { reviews: Review[] }) {
  return (
    <section className="review-stage py-16 text-white">
      <div className="container-pad">
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase text-[#26d7c7]">Customer confessions</p>
          <h2 className="mt-2 text-3xl font-semibold md:text-5xl">A little more confidence looks good on everyone.</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {reviews.map((review) => (
            <Card key={review.id} className="border-white/10 bg-white/[0.06] text-white shadow-2xl backdrop-blur">
              <CardContent className="pt-5">
                <div className="flex gap-1 text-[#f6bf70]" aria-label={`${review.rating} stars`}>
                  {Array.from({ length: review.rating }).map((_, index) => (
                    <Star key={index} className="size-4 fill-current" />
                  ))}
                </div>
                <h3 className="mt-4 font-semibold">{review.title}</h3>
                <p className="mt-2 text-sm leading-6 text-white/65">{review.content}</p>
                <p className="mt-4 text-sm font-medium text-[#ff79ad]">{review.author}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
