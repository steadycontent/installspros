import { useState } from "react";
import { useGoogleAdsAccounts } from "@/hooks/useGoogleAdsAccounts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Save, Plus, CheckCircle, XCircle, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

export default function GoogleAdsSettings() {
  const { accounts, isLoading, createAccount, updateAccount } = useGoogleAdsAccounts();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  const [form, setForm] = useState({
    account_name: "",
    customer_id: "",
    developer_token: "",
    client_id: "",
    client_secret: "",
    refresh_token: "",
  });

  const resetForm = () => {
    setForm({
      account_name: "",
      customer_id: "",
      developer_token: "",
      client_id: "",
      client_secret: "",
      refresh_token: "",
    });
  };

  const startEdit = (account: any) => {
    setEditingId(account.id);
    setForm({
      account_name: account.account_name,
      customer_id: account.customer_id,
      developer_token: account.developer_token,
      client_id: account.client_id,
      client_secret: account.client_secret,
      refresh_token: account.refresh_token,
    });
    setShowCreate(false);
  };

  const handleSave = async () => {
    try {
      if (editingId) {
        await updateAccount.mutateAsync({ id: editingId, ...form });
        toast({ title: "Account updated" });
        setEditingId(null);
      } else {
        await createAccount.mutateAsync(form);
        toast({ title: "Account created" });
        setShowCreate(false);
      }
      resetForm();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const isFormActive = editingId || showCreate;
  const isSaving = createAccount.isPending || updateAccount.isPending;

  return (
    <div className="p-6 lg:p-8 space-y-8">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/admin/google-ads"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Google Ads Settings</h1>
          <p className="text-sm text-muted-foreground">Manage your Google Ads API credentials</p>
        </div>
      </div>

      {/* Existing accounts */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          {accounts.map((account) => (
            <Card key={account.id} className={editingId === account.id ? "ring-2 ring-primary" : ""}>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base">{account.account_name}</CardTitle>
                  <CardDescription>
                    CID: {account.customer_id || "Not configured"} ·{" "}
                    {account.is_active ? (
                      <span className="inline-flex items-center gap-1 text-green-600"><CheckCircle className="h-3 w-3" /> Active</span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-muted-foreground"><XCircle className="h-3 w-3" /> Inactive</span>
                    )}
                  </CardDescription>
                </div>
                {editingId !== account.id && (
                  <Button variant="outline" size="sm" onClick={() => startEdit(account)}>
                    Edit
                  </Button>
                )}
              </CardHeader>
              {editingId === account.id && (
                <CardContent>
                  <CredentialForm form={form} setForm={setForm} onSave={handleSave} onCancel={() => { setEditingId(null); resetForm(); }} isSaving={isSaving} />
                </CardContent>
              )}
            </Card>
          ))}

          {/* Add new account */}
          {!showCreate && !editingId && (
            <Button variant="outline" onClick={() => { setShowCreate(true); resetForm(); }}>
              <Plus className="h-4 w-4 mr-1" /> Add Google Ads Account
            </Button>
          )}

          {showCreate && (
            <Card className="ring-2 ring-primary">
              <CardHeader>
                <CardTitle className="text-base">New Google Ads Account</CardTitle>
                <CardDescription>Enter your Google Ads API credentials</CardDescription>
              </CardHeader>
              <CardContent>
                <CredentialForm form={form} setForm={setForm} onSave={handleSave} onCancel={() => { setShowCreate(false); resetForm(); }} isSaving={isSaving} />
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}

function CredentialForm({
  form,
  setForm,
  onSave,
  onCancel,
  isSaving,
}: {
  form: any;
  setForm: (f: any) => void;
  onSave: () => void;
  onCancel: () => void;
  isSaving: boolean;
}) {
  const fields = [
    { key: "account_name", label: "Account Name", placeholder: "InstallPros Main", type: "text" },
    { key: "customer_id", label: "Customer ID", placeholder: "1234567890 (no dashes)", type: "text" },
    { key: "developer_token", label: "Developer Token", placeholder: "Your developer token", type: "password" },
    { key: "client_id", label: "OAuth Client ID", placeholder: "xxxx.apps.googleusercontent.com", type: "text" },
    { key: "client_secret", label: "OAuth Client Secret", placeholder: "GOCSPX-...", type: "password" },
    { key: "refresh_token", label: "Refresh Token", placeholder: "1//...", type: "password" },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fields.map((field) => (
          <div key={field.key} className="space-y-2">
            <Label htmlFor={field.key}>{field.label}</Label>
            <Input
              id={field.key}
              type={field.type}
              value={form[field.key]}
              onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
              placeholder={field.placeholder}
              size="sm"
            />
          </div>
        ))}
      </div>
      <div className="flex gap-2 justify-end">
        <Button variant="outline" size="sm" onClick={onCancel}>Cancel</Button>
        <Button size="sm" onClick={onSave} disabled={isSaving}>
          {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Save className="h-4 w-4 mr-1" />}
          Save
        </Button>
      </div>
    </div>
  );
}
