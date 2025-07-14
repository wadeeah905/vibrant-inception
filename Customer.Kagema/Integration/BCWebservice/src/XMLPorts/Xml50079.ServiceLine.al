xmlport 50079 "Service Line"
{
    FormatEvaluate = Xml;
    UseDefaultNamespace = true;
    DefaultFieldsValidation = true;
    Format = Xml;
    schema
    {
        textelement(ServiceLineXML)
        {
            //XmlName = 'ServiceLine';

            tableelement(ServiceLine; "Service Line")
            {
                XmlName = 'ServiceLine';
                //UseTemporary=true
                LinkTableForceInsert = true;
                AutoUpdate = true;
                AutoSave = true;
                MinOccurs = Zero;

                fieldelement(CustomerNo; ServiceLine."Customer No.")
                {
                    MinOccurs = Zero;
                }
                fieldelement(DocumentType; ServiceLine."Document Type")
                {
                    MinOccurs = Zero;
                }
                fieldelement(DocumentNo; ServiceLine."Document No.")
                {
                    MinOccurs = Zero;
                }
                fieldelement(ServiceItemNo; ServiceLine."Service Item No.")
                {
                    MinOccurs = Zero;
                }

                fieldelement(ServiceItemLineNo; ServiceLine."Service Item Line No.")
                {
                    MinOccurs = Zero;
                    /* trigger OnBeforePassField();
                     begin


                         IF ServiceLine."Service Item Line No." = 0 then
                             ServiceLine."Service Item Line No." := GetServiceItemLineNo(ServiceLine."Document No.");


                     end;*/
                }
                fieldelement(LineNo; ServiceLine."Line No.")
                {
                    MinOccurs = Zero;
                    FieldValidate = No;
                    trigger OnAfterAssignField();
                    begin


                        IF ServiceLine."Line No." = 0 then
                            ServiceLine."Line No." := GetServiceLineNo(ServiceLine."Document No.");


                    end;

                }
                fieldelement(Type; ServiceLine.Type)
                {
                    MinOccurs = Zero;
                }

                fieldelement(No; ServiceLine."No.")
                {
                    MinOccurs = Zero;
                    FieldValidate = Yes;

                    // trigger OnAfterAssignField()

                    // begin
                    //     validateItem(ServiceLine."Document No.", ServiceLine."No.");
                    // end;
                }




                fieldelement(LocationCode; ServiceLine."Location Code")
                {
                    MinOccurs = Zero;
                }

                fieldelement(Description; ServiceLine.Description)
                {
                    MinOccurs = Zero;
                }
                fieldelement(Description2; ServiceLine."Description 2")
                {
                    MinOccurs = Zero;
                }
                fieldelement(WorkTypeCode; ServiceLine."Work Type Code")
                {
                    MinOccurs = Zero;
                }

                Textelement(StrPostingDate)
                {
                    MinOccurs = Zero;
                    trigger OnBeforePassVariable();
                    begin
                        Evaluate(ServiceLine."Posting Date", StrPostingDate);
                    end;

                    trigger OnAfterAssignVariable();
                    begin
                        Evaluate(ServiceLine."Posting Date", StrPostingDate);
                    end;
                }




                fieldelement(ShiptoCode; ServiceLine."Ship-to Code")
                {
                    MinOccurs = Zero;
                }

                fieldelement(UnitCostLCY; ServiceLine."Unit Cost (LCY)")
                {
                    //FieldValidate = Yes;
                    MinOccurs = Zero;
                }
                fieldelement(UnitCost; ServiceLine."Unit Cost")
                {
                    MinOccurs = Zero;
                    // FieldValidate = Yes;
                }
                fieldelement(UnitofMeasureCode; ServiceLine."Unit of Measure Code")
                {
                    MinOccurs = Zero;
                }

                fieldelement(UnitPrice; ServiceLine."Unit Price")
                {
                    MinOccurs = Zero;

                }






                fieldelement(QuantityB; ServiceLine."Quantity (Base)")
                {
                    MinOccurs = Zero;
                    //FieldValidate = Yes;
                }
                fieldelement(Quantity; ServiceLine.Quantity)
                {
                    MinOccurs = Zero;
                    FieldValidate = Yes;
                    // trigger OnAfterAssignField()

                    // begin
                    //     validateItem(ServiceLine."Document No.", ServiceLine."No.");
                    //     ServiceLine."Qty. to Ship" := ServiceLine.Quantity;
                    // end;


                }
                fieldelement(QtytoShip; ServiceLine."Qty. to Ship")
                {
                    MinOccurs = Zero;
                    //FieldValidate = Yes;

                }
                fieldelement(QtytoInvoice; ServiceLine."Qty. to Invoice")
                {
                    MinOccurs = Zero;

                }

                fieldelement(Calculate; ServiceLine.Berechnen)
                {
                    MinOccurs = Zero;
                }
                fieldelement(OnReport; ServiceLine.Summe)
                {
                    MinOccurs = Zero;
                }

                fieldelement(EKStatus; ServiceLine."EK Status")
                {
                    MinOccurs = Zero;
                }
                fieldelement(VendorNo; ServiceLine."Vendor No.")
                {
                    MinOccurs = Zero;
                }
                fieldelement(ShelfNo; ServiceLine.ShelfNo)
                {
                    MinOccurs = Zero;
                }
                //need to be rnamed and fix it in teh solution
                fieldelement(GenBusPostingGroup; ServiceLine."Gen. Prod. Posting Group")
                {
                    MinOccurs = Zero;
                }

                fieldelement(VATProdPostingGroup; ServiceLine."VAT Prod. Posting Group")
                {
                    MinOccurs = Zero;
                }


                fieldelement(ShortcutDimensionCode; ServiceLine."Shortcut Dimension 1 Code")
                {
                    MinOccurs = Zero;
                }
                fieldelement(LineNoCode; ServiceLine."Line No. Code")
                {
                    MinOccurs = Zero;
                    trigger OnAfterAssignField();
                    begin


                        IF ServiceLine."Line No. Code" = '0' then
                            if (ServiceLine."Line No." = 0) then
                                ServiceLine."Line No. Code" := Format(GetServiceLineNo(ServiceLine."Document No."))
                            else
                                ServiceLine."Line No. Code" := Format(ServiceLine."Line No.");


                    end;
                }

            }

        }

    }

    requestpage
    {
        layout
        {
            area(content)
            {
                group(GroupName)
                {
                }
            }
        }
        actions
        {
            area(processing)
            {
            }
        }
    }
    procedure GetServiceLineNo(DocNo: code[20]): integer
    var
        RecLServiceLine: Record "Service Line";
    begin
        RecLServiceLine.SetRange("Document Type", RecLServiceLine."Document Type"::Order);
        RecLServiceLine.SetRange("Document No.", DocNo);
        IF RecLServiceLine.FindLast() then
            exit(RecLServiceLine."Line No." + 10000)
        else
            exit(10000);
    end;

    procedure validateItem(DocNo: code[20]; itemNo: Code[50])
    var
        RecLServiceLine: Record "Service Line";
    begin
        RecLServiceLine.SetRange("Document Type", RecLServiceLine."Document Type"::Order);
        RecLServiceLine.SetRange("Document No.", DocNo);
        RecLServiceLine.SetRange("No.", itemNo);
        IF RecLServiceLine.FindLast() then
            RecLServiceLine.Validate("No.", itemNo);

    end;
    /*
       procedure GetServiceItemLineNo(DocNo: code[20]): integer
       var
           RecLServiceLine: Record "Service item Line";
       begin
           RecLServiceLine.SetRange("Document Type", RecLServiceLine."Document Type"::Order);
           RecLServiceLine.SetRange("Document No.", DocNo);
           IF RecLServiceLine.FindFirst() then
               exit(RecLServiceLine."Line No.")
           else
               exit(10000);
       end;*/
}
