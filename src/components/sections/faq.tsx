import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  ["Is packaging discreet?", "Yes. Orders ship in plain external packaging with neutral sender details."],
  ["Are payments secure?", "The checkout is prepared for Stripe integration and uses secure payment placeholders in this demo."],
  ["Can a CMS power this storefront?", "Yes. The catalog access layer is isolated so products can be replaced with a headless CMS source."],
  ["Is this an 18+ storefront?", "Yes. The brand, category copy, and merchandising are written for adult customers only."],
];

export function FAQ() {
  return (
    <section className="py-12">
      <div className="container-pad max-w-3xl">
        <p className="text-sm font-semibold uppercase text-primary">FAQ</p>
        <h2 className="mt-2 text-2xl font-semibold md:text-3xl">Shopping with confidence</h2>
        <Accordion type="single" collapsible className="mt-6">
          {faqs.map(([question, answer], index) => (
            <AccordionItem key={question} value={`item-${index}`}>
              <AccordionTrigger>{question}</AccordionTrigger>
              <AccordionContent>{answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
