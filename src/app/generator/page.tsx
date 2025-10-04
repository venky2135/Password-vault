import { PasswordGeneratorForm } from "@/components/password-generator-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function GeneratorPage() {
  return (
    <div className="flex justify-center items-start py-8 md:py-12">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Password Generator</CardTitle>
        </CardHeader>
        <CardContent>
          <PasswordGeneratorForm />
        </CardContent>
      </Card>
    </div>
  );
}
