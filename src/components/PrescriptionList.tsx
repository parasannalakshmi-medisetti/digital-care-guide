import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { FileText, Calendar, Heart, AlertCircle } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

interface Prescription {
  id: string;
  medications: string;
  dosage_instructions: string;
  health_tips: string;
  follow_up_date: string;
  notes: string;
  created_at: string;
  doctor: {
    full_name: string;
    specialization: string;
  };
}

const PrescriptionList = () => {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchPrescriptions();
    }
  }, [user]);

  const fetchPrescriptions = async () => {
    try {
      const { data: patientData, error: patientError } = await supabase
        .from('patients')
        .select('id')
        .eq('user_id', user?.id)
        .single();

      if (patientError) {
        throw new Error('Patient profile not found');
      }

      const { data, error } = await supabase
        .from('prescriptions')
        .select(`
          *,
          doctor:doctors(full_name, specialization)
        `)
        .eq('patient_id', patientData.id)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error('Failed to fetch prescriptions');
      }

      setPrescriptions(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load prescriptions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-muted rounded w-1/2"></div>
              <div className="h-3 bg-muted rounded w-1/3"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-3 bg-muted rounded"></div>
                <div className="h-3 bg-muted rounded w-3/4"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (prescriptions.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Prescriptions Yet</h3>
          <p className="text-muted-foreground">
            Your prescriptions will appear here after consultations with doctors.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {prescriptions.map((prescription) => (
        <Card key={prescription.id} className="shadow-medium">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Prescription from {prescription.doctor.full_name}
                </CardTitle>
                <CardDescription>
                  {prescription.doctor.specialization} • {new Date(prescription.created_at).toLocaleDateString()}
                </CardDescription>
              </div>
              {prescription.follow_up_date && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Follow-up: {new Date(prescription.follow_up_date).toLocaleDateString()}
                </Badge>
              )}
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-destructive" />
                Medications & Dosage
              </h4>
              <div className="bg-muted/50 p-3 rounded-lg">
                <p className="text-sm">{prescription.medications}</p>
              </div>
              <div className="mt-2 bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg">
                <p className="text-sm text-blue-800 dark:text-blue-200">{prescription.dosage_instructions}</p>
              </div>
            </div>

            {prescription.health_tips && (
              <>
                <Separator />
                <div>
                  <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                    <Heart className="h-4 w-4 text-green-600" />
                    Health Tips
                  </h4>
                  <div className="bg-green-50 dark:bg-green-950/20 p-3 rounded-lg">
                    <p className="text-sm text-green-800 dark:text-green-200">{prescription.health_tips}</p>
                  </div>
                </div>
              </>
            )}

            {prescription.notes && (
              <>
                <Separator />
                <div>
                  <h4 className="font-semibold text-sm mb-2">Doctor's Notes</h4>
                  <p className="text-sm text-muted-foreground">{prescription.notes}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PrescriptionList;