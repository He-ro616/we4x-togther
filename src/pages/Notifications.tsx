import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { GoogleFormModal } from "@/components/GoogleFormModal";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

interface GoogleForm {
  id: string;
  title: string;
  description: string | null;
  form_url: string;
  form_id: string;
  embed_code: string | null;
  is_active: boolean;
  access_level: string;
}

export default function Notifications() {
  const [forms, setForms] = useState<GoogleForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedForm, setSelectedForm] = useState<GoogleForm | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchForms();
  }, []);

  const fetchForms = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("google_forms")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setForms(data || []);
    } catch (err) {
      console.error("Error fetching forms:", err);
      toast({ description: "Failed to load forms" });
    } finally {
      setLoading(false);
    }
  };

  const handleFormClick = (form: GoogleForm) => {
    setSelectedForm(form);
    setIsModalOpen(true);
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">Notifications & Forms</h1>

      {/* Forms Section */}
      {forms.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Available Forms</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {forms.map((form) => (
              <div
                key={form.id}
                className="p-4 border rounded-lg hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => handleFormClick(form)}
              >
                <h3 className="font-semibold text-lg mb-2">{form.title}</h3>
                {form.description && (
                  <p className="text-sm text-muted-foreground mb-3">
                    {form.description}
                  </p>
                )}
                <Button className="w-full" variant="default">
                  Open Form
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Notifications Placeholder */}
      <div className="text-center py-12 border-t">
        <h2 className="text-xl font-semibold mb-2">Your Notifications</h2>
        <p className="text-muted-foreground">
          Stay tuned! Your personalized notifications will appear here.
        </p>
      </div>

      {/* Google Form Modal */}
      {selectedForm && (
        <GoogleFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={selectedForm.title}
          description={selectedForm.description || undefined}
          formId={selectedForm.form_id}
          embedCode={selectedForm.embed_code || undefined}
          formUrl={selectedForm.form_url}
        />
      )}
    </div>
  );
}

