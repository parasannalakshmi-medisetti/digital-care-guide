import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { ChevronRight, Stethoscope } from "lucide-react";

interface SymptomsFormProps {
  onSymptomsSubmit: (symptoms: string, category: string) => void;
  onBack: () => void;
}

const SymptomsForm = ({ onSymptomsSubmit, onBack }: SymptomsFormProps) => {
  const [symptoms, setSymptoms] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const symptomCategories = [
    {
      category: "General Medicine",
      keywords: ["fever", "headache", "fatigue", "nausea", "vomiting", "dizziness", "weakness", "cold", "flu", "cough", "sore throat", "body ache"],
      specializations: ["General Medicine", "Internal Medicine", "Family Medicine"]
    },
    {
      category: "Cardiology",
      keywords: ["chest pain", "heart", "cardiac", "palpitations", "shortness of breath", "chest tightness", "irregular heartbeat", "heart attack", "angina", "hypertension", "blood pressure"],
      specializations: ["Cardiology", "Cardiovascular Surgery", "Heart"]
    },
    {
      category: "Orthopedics",
      keywords: ["bone", "joint", "muscle", "back pain", "knee pain", "fracture", "sprain", "arthritis", "shoulder pain", "hip pain", "ankle", "wrist", "spine", "neck pain"],
      specializations: ["Orthopedics", "Sports Medicine", "Bone", "Joint", "Spine"]
    },
    {
      category: "Dermatology",
      keywords: ["skin", "rash", "acne", "eczema", "psoriasis", "mole", "dermatitis", "itching", "dry skin", "spots", "blemishes", "allergic reaction", "hives"],
      specializations: ["Dermatology", "Skin"]
    },
    {
      category: "Neurology",
      keywords: ["migraine", "seizure", "neurological", "nerve", "brain", "memory", "coordination", "headache", "dizziness", "vertigo", "numbness", "tingling", "stroke"],
      specializations: ["Neurology", "Neurosurgery", "Brain", "Nerve"]
    },
    {
      category: "Gastroenterology",
      keywords: ["stomach", "digestive", "abdominal", "diarrhea", "constipation", "acid reflux", "heartburn", "bloating", "nausea", "stomach pain", "intestinal", "bowel"],
      specializations: ["Gastroenterology", "Digestive", "Stomach"]
    },
    {
      category: "Pediatrics",
      keywords: ["child", "children", "baby", "infant", "toddler", "kid", "pediatric", "vaccination", "growth", "development"],
      specializations: ["Pediatrics", "Child", "Children"]
    },
    {
      category: "Psychiatry",
      keywords: ["anxiety", "depression", "stress", "mental health", "mood", "panic", "psychological", "therapy", "counseling", "bipolar", "adhd"],
      specializations: ["Psychiatry", "Mental Health", "Psychology"]
    },
    {
      category: "ENT",
      keywords: ["ear", "nose", "throat", "hearing", "sinus", "tonsils", "voice", "swallowing", "snoring", "ear infection", "nasal congestion"],
      specializations: ["ENT", "Ear", "Nose", "Throat", "Otolaryngology"]
    },
    {
      category: "Ophthalmology",
      keywords: ["eye", "vision", "sight", "glasses", "contacts", "blurred vision", "eye pain", "red eyes", "cataracts", "glaucoma"],
      specializations: ["Ophthalmology", "Eye", "Vision"]
    },
    {
      category: "Urology",
      keywords: ["kidney", "bladder", "urinary", "urine", "prostate", "urination", "uti", "kidney stones", "incontinence"],
      specializations: ["Urology", "Kidney", "Bladder"]
    },
    {
      category: "Gynecology",
      keywords: ["women", "female", "period", "menstrual", "pregnancy", "gynecological", "reproductive", "ovarian", "cervical", "breast"],
      specializations: ["Gynecology", "Obstetrics", "Women's Health"]
    }
  ];

  const detectCategory = (symptomsText: string) => {
    const lowerSymptoms = symptomsText.toLowerCase();
    let bestMatch = { category: "General Medicine", score: 0 };
    
    for (const cat of symptomCategories) {
      let matchScore = 0;
      for (const keyword of cat.keywords) {
        if (lowerSymptoms.includes(keyword)) {
          matchScore += keyword.length; // Longer keywords get higher scores
        }
      }
      if (matchScore > bestMatch.score) {
        bestMatch = { category: cat.category, score: matchScore };
      }
    }
    
    return bestMatch.category;
  };

  const handleSubmit = () => {
    if (!symptoms.trim()) return;
    
    const category = selectedCategory || detectCategory(symptoms);
    onSymptomsSubmit(symptoms, category);
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
  };

  return (
    <div className="space-y-6 max-h-[70vh] overflow-y-auto">
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto bg-gradient-primary p-3 rounded-full w-fit mb-3">
            <Stethoscope className="h-6 w-6 text-white" />
          </div>
          <CardTitle className="text-xl">Describe Your Symptoms</CardTitle>
          <CardDescription>
            Tell us what you're experiencing so we can connect you with the right specialist
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="symptoms" className="text-sm font-medium">
              What symptoms are you experiencing?
            </Label>
            <Textarea
              id="symptoms"
              placeholder="Please describe your symptoms in detail. For example: 'I have been experiencing chest pain and shortness of breath for the past 2 days...'"
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              className="min-h-[120px] resize-none"
            />
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium">
              Or select a category that best matches your concern:
            </Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {symptomCategories.map((cat) => (
                <Badge
                  key={cat.category}
                  variant={selectedCategory === cat.category ? "default" : "outline"}
                  className="p-2 cursor-pointer hover:bg-primary/10 transition-colors text-center justify-center"
                  onClick={() => handleCategorySelect(cat.category)}
                >
                  {cat.category}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={onBack} className="flex-1">
              Back
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={!symptoms.trim()}
              className="flex-1"
            >
              Find Doctors
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {symptoms && (
        <Card className="bg-muted/50">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Detected Category:</h4>
              <Badge variant="secondary">
                {selectedCategory || detectCategory(symptoms)}
              </Badge>
              <p className="text-xs text-muted-foreground">
                We'll show you doctors specializing in this area
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SymptomsForm;