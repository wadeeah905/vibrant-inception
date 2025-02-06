import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useNavigate } from "react-router-dom";

interface ExistingDesignDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClearDesign: () => void;
}

const ExistingDesignDialog = ({
  open,
  onOpenChange,
  onClearDesign,
}: ExistingDesignDialogProps) => {
  const navigate = useNavigate();

  const handleContinueToQuote = () => {
    onOpenChange(false);
    navigate('/devis');
  };

  const handleClearAndStart = () => {
    onClearDesign();
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Design existant détecté</AlertDialogTitle>
          <AlertDialogDescription>
            Vous avez déjà un design en cours de validation. Voulez-vous effacer ce design et en créer un nouveau, ou continuer vers la demande de devis avec le design actuel ?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction onClick={handleClearAndStart} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
            Effacer et recommencer
          </AlertDialogAction>
          <AlertDialogAction onClick={handleContinueToQuote} className="bg-primary">
            Continuer vers le devis
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ExistingDesignDialog;