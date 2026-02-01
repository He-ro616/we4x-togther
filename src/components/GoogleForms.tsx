import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";

interface GoogleFormFormProps {
  initialData?: {
    id: string;
    title: string;
    description: string | null;
    form_url: string;
    form_id: string;
    embed_code: string | null;
    is_active: boolean;
    access_level: string;
  } | null;
  onSubmit: (data: FormData) => Promise<void>;
  isLoading: boolean;
}

interface FormData {
  title: string;
  description: string;
  form_url: string;
  form_id: string;
  embed_code: string;
  is_active: boolean;
  access_level: string;
}

export function GoogleFormForm({
  initialData,
  onSubmit,
  isLoading,
}: GoogleFormFormProps) {
  const [formData, setFormData] = useState<FormData>(
    initialData || {
      title: "",
      description: "",
      form_url: "",
      form_id: "",
      embed_code: "",
      is_active: true,
      access_level: "public",
    }
  );

  const extractFormId = (url: string): string => {
    const match = url.match(/\/forms\/d\/([a-zA-Z0-9-_]+)/);
    return match ? match[1] : "";
  };

  const handleUrlChange = (url: string) => {
    setFormData({
      ...formData,
      form_url: url,
      form_id: extractFormId(url),
    });
  };

  const validateForm = (): boolean => {
    if (!formData.title.trim()) {
      toast({ description: "Title is required" });
      return false;
    }
    if (!formData.form_url.trim()) {
      toast({ description: "Google Form URL is required" });
      return false;
    }
    if (!formData.form_id) {
      toast({ description: "Invalid Google Form URL. Could not extract form ID." });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Form Title *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="e.g., Feedback Form"
          disabled={isLoading}
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          placeholder="Optional: Brief description of what this form is for"
          disabled={isLoading}
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="form_url">Google Form URL *</Label>
        <Input
          id="form_url"
          value={formData.form_url}
          onChange={(e) => handleUrlChange(e.target.value)}
          placeholder="https://docs.google.com/forms/d/YOUR_FORM_ID/viewform"
          disabled={isLoading}
        />
        <p className="text-xs text-muted-foreground mt-1">
          Copy the Google Form share link (not edit link)
        </p>
        {formData.form_id && (
          <p className="text-xs text-green-600 mt-1">
            ✓ Form ID detected: {formData.form_id.substring(0, 10)}...
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="embed_code">Custom Embed Code (Optional)</Label>
        <Textarea
          id="embed_code"
          value={formData.embed_code}
          onChange={(e) =>
            setFormData({ ...formData, embed_code: e.target.value })
          }
          placeholder="Paste custom iframe or embed code if needed"
          disabled={isLoading}
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="access_level">Access Level</Label>
          <Select
            value={formData.access_level}
            onValueChange={(value) =>
              setFormData({ ...formData, access_level: value })
            }
            disabled={isLoading}
          >
            <SelectTrigger id="access_level">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="public">Public (All logged-in users)</SelectItem>
              <SelectItem value="members_only">Members Only</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-end">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.is_active}
              onChange={(e) =>
                setFormData({ ...formData, is_active: e.target.checked })
              }
              disabled={isLoading}
            />
            <span className="text-sm">Active</span>
          </label>
        </div>
      </div>

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? "Saving..." : initialData ? "Update Form" : "Add Form"}
      </Button>
    </form>
  );
}
