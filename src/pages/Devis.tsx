import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useLocation, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Send, Type, Image as ImageIcon, Palette } from "lucide-react";
import { products } from "@/config/products";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const Devis = () => {
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const designData = location.state;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    productType: designData?.productName || products[0].name,
    size: designData?.selectedSize || '',
    quantity: designData?.quantity?.toString() || '',
    description: '',
    additionalNotes: ''
  });

  const isQuoteRequestEnabled = 
    formData.size.trim() !== '' && 
    formData.quantity.trim() !== '' && 
    parseInt(formData.quantity) >= 1;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isQuoteRequestEnabled) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner une taille et une quantité (minimum 1)",
        variant: "destructive"
      });
      return;
    }
    console.log('Form submitted:', { ...formData, designData });
    toast({
      title: "Demande envoyée",
      description: "Nous vous contacterons bientôt avec votre devis personnalisé.",
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleBack = () => {
    navigate(-1);
  };

  const getTextStyleDescription = (style: any) => {
    const styles = [];
    if (style.bold) styles.push('Gras');
    if (style.italic) styles.push('Italique');
    if (style.underline) styles.push('Souligné');
    styles.push(`Aligné ${style.align === 'center' ? 'au centre' : style.align === 'right' ? 'à droite' : 'à gauche'}`);
    return styles.join(', ');
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Button
        variant="ghost"
        onClick={handleBack}
        className="mb-6 hover:bg-gray-100"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Retour
      </Button>

      <div className="max-w-5xl mx-auto">
        {designData && (
          <Card className="p-6 mb-8">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-semibold">
                Devis ({designData.designNumber}) - {designData.productName}
              </h2>
              <div className="bg-primary/5 p-3 rounded-lg space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-600">Taille:</span>
                  <Badge variant="secondary">{designData.selectedSize}</Badge>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-600">Quantité:</span>
                  <Badge variant="secondary">{designData.quantity} unités</Badge>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-gray-500">Produit</Label>
                  <p className="font-medium">{designData.productName}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-500">Taille</Label>
                  <p className="font-medium">{designData.selectedSize}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-500">Quantité</Label>
                  <p className="font-medium">{designData.quantity} unités</p>
                </div>
              </div>

              <Separator className="my-4" />

              <div>
                <Label className="text-sm text-gray-500 mb-2 block">Aperçu des Designs</Label>
                <ScrollArea className="h-[400px] rounded-md border p-4">
                  {Object.entries(designData.designs || {}).map(([key, design]: [string, any]) => (
                    <div key={key} className="mb-8 last:mb-0">
                      <h3 className="font-medium mb-4 flex items-center gap-2">
                        <Badge variant="outline">Face: {design.faceId}</Badge>
                      </h3>
                      
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                          <img 
                            src={design.canvasImage} 
                            alt={`Design ${design.faceId}`}
                            className="w-full rounded-lg border shadow-sm"
                          />
                        </div>
                        
                        <div className="space-y-4">
                          {design.textElements?.length > 0 && (
                            <div className="space-y-3">
                              <h4 className="font-medium flex items-center gap-2">
                                <Type className="h-4 w-4" />
                                Textes
                              </h4>
                              {design.textElements.map((text: any, idx: number) => (
                                <Card key={idx} className="p-3 bg-gray-50">
                                  <p className="font-medium text-sm">{text.content}</p>
                                  <div className="mt-2 flex flex-wrap gap-2">
                                    <Badge variant="secondary" className="text-xs">
                                      {text.font}
                                    </Badge>
                                    <Badge variant="secondary" className="text-xs flex items-center gap-1">
                                      <div 
                                        className="w-2 h-2 rounded-full" 
                                        style={{ backgroundColor: text.color }}
                                      />
                                      {text.color}
                                    </Badge>
                                    <Badge variant="secondary" className="text-xs">
                                      {text.size}px
                                    </Badge>
                                  </div>
                                  <p className="text-xs text-gray-500 mt-2">
                                    {getTextStyleDescription(text.style)}
                                  </p>
                                </Card>
                              ))}
                            </div>
                          )}

                          {design.uploadedImages?.length > 0 && (
                            <div className="space-y-3">
                              <h4 className="font-medium flex items-center gap-2">
                                <ImageIcon className="h-4 w-4" />
                                Images ({design.uploadedImages.length})
                              </h4>
                              <div className="grid grid-cols-2 gap-2">
                                {design.uploadedImages.map((img: any, idx: number) => (
                                  <div key={idx} className="relative aspect-square rounded-md overflow-hidden border">
                                    <img 
                                      src={img.url} 
                                      alt={img.name}
                                      className="w-full h-full object-cover"
                                    />
                                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-1">
                                      <p className="text-xs text-white truncate">
                                        {img.name}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </ScrollArea>
              </div>
            </div>
          </Card>
        )}

        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-primary mb-6">Demande de Devis Personnalisé</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Nom complet</Label>
                <Input
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="productType">Type de produit</Label>
                <select
                  id="productType"
                  name="productType"
                  className="w-full border border-gray-300 rounded-md p-2"
                  value={formData.productType}
                  onChange={handleChange}
                  required
                >
                  {products.map((product) => (
                    <option key={product.id} value={product.name}>
                      {product.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="size">Taille</Label>
                <Input
                  id="size"
                  name="size"
                  required
                  value={formData.size}
                  onChange={handleChange}
                  readOnly={!!designData}
                  className={designData ? "bg-gray-50" : ""}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">Quantité</Label>
                <Input
                  id="quantity"
                  name="quantity"
                  type="number"
                  min="1"
                  required
                  value={formData.quantity}
                  onChange={handleChange}
                  readOnly={!!designData}
                  className={designData ? "bg-gray-50" : ""}
                />
              </div>
            </div>

            {!designData && (
              <div className="space-y-2">
                <Label htmlFor="description">Description détaillée</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Décrivez votre projet en détail..."
                  className="min-h-[100px]"
                  required={!designData}
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="additionalNotes">Notes supplémentaires</Label>
              <Textarea
                id="additionalNotes"
                name="additionalNotes"
                placeholder="Autres informations importantes..."
                value={formData.additionalNotes}
                onChange={handleChange}
              />
            </div>

            <Button
              type="submit"
              className="w-full md:w-auto px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!isQuoteRequestEnabled}
            >
              <Send className="mr-2 h-4 w-4" />
              Envoyer la demande
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Devis;
