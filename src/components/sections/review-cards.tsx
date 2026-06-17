import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { Review } from "@/types/product";

export function ReviewCards({ reviews }: { reviews: Review[] }) {
  return (
    <section className="py-12">
      <div className="container-pad">
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase text-primary">Customer notes</p>
          <h2 className="mt-2 text-2xl font-semibold md:text-3xl">Luxury, discretion, and confidence</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {reviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="pt-5">
                <div className="flex gap-1 text-primary" aria-label={`${review.rating} stars`}>
                  {Array.from({ length: review.rating }).map((_, index) => (
                    <Star key={index} className="size-4 fill-current" />
                  ))}
                </div>
                <h3 className="mt-4 font-semibold">{review.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{review.content}</p>
                <p className="mt-4 text-sm font-medium">{review.author}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
