xmlport 50076 "Service Item Line"
{
    FormatEvaluate = Xml;
    UseDefaultNamespace = true;
    Format = Xml;
    schema
    {
        textelement(ServiceItemLineXML)
        {
            //XmlName = 'ServiceItemLine';

            tableelement(ServiceItemLine; "Service Item Line")
            {
                XmlName = 'ServiceItemLine';
                //UseTemporary=true
                LinkTableForceInsert = true;
                AutoUpdate = true;
                AutoSave = true;
                MinOccurs = Zero;

                fieldelement(DocumentType; ServiceItemLine."Document Type")
                {
                    MinOccurs = Zero;
                }
                fieldelement(DocumentNo; ServiceItemLine."Document No.")
                {
                    MinOccurs = Zero;

                }
                fieldelement(LineNo; ServiceItemLine."Line No.")
                {
                    MinOccurs = Zero;
                }

                fieldelement(ServiceItemNo; ServiceItemLine."Service Item No.")
                {
                    MinOccurs = Zero;
                    FieldValidate = Yes;
                }

                fieldelement(ItemNo; ServiceItemLine."Item No.")
                {
                    MinOccurs = Zero;
                    FieldValidate = Yes;
                }


                /*textelement(StrModifyDate)
                {
                    MinOccurs = Zero;
                    trigger onbeforePassvariable();
                    begin
                        Evaluate("ServiceItemLine"."Modify Date", StrModifyDate);
                    end;

                    trigger OnAfterAssignVariable();
                    begin
                        Evaluate("ServiceItemLine"."Modify Date", StrModifyDate);
                    end;
                }*/
                fieldelement(ActualResponseTimeHours; ServiceItemLine."Actual Response Time (Hours)")
                {
                    MinOccurs = Zero;

                }
                fieldelement(AdjustmentType; ServiceItemLine."Adjustment Type")
                {
                    MinOccurs = Zero;
                }
                /*fieldelement(AllocationDateFilter; ServiceItemLine."Allocation Date Filter")
                {
                    MinOccurs = Zero;
                }
                fieldelement(AllocationStatusFilter; ServiceItemLine."Allocation Status Filter")
                {
                    MinOccurs = Zero;
                }*/
                fieldelement(BaseAmounttoAdjust; ServiceItemLine."Base Amount to Adjust")
                {
                    MinOccurs = Zero;
                }
                fieldelement(ContractLineNo; ServiceItemLine."Contract Line No.")
                {
                    MinOccurs = Zero;
                }
                fieldelement(ContractNo; ServiceItemLine."Contract No.")
                {
                    MinOccurs = Zero;
                }
                fieldelement(CustomerNo; ServiceItemLine."Customer No.")
                {
                    MinOccurs = Zero;
                }
                /* fieldelement(DateFilter; ServiceItemLine."Date Filter")
                 {
                     MinOccurs = Zero;
                 }*/
                fieldelement(Description2; ServiceItemLine."Description 2")
                {
                    MinOccurs = Zero;
                }
                fieldelement(DimensionSetID; ServiceItemLine."Dimension Set ID")
                {
                    MinOccurs = Zero;
                }

                fieldelement(FaultAreaCode; ServiceItemLine."Fault Area Code")
                {
                    MinOccurs = Zero;
                }
                fieldelement(FaultCode; ServiceItemLine."Fault Code")
                {
                    MinOccurs = Zero;
                }
                fieldelement(FaultComment; ServiceItemLine."Fault Comment")
                {
                    MinOccurs = Zero;
                }
                fieldelement(FaultReasonCode; ServiceItemLine."Fault Reason Code")
                {
                    MinOccurs = Zero;
                }
                textelement(StrFinishingDate)
                {
                    MinOccurs = Zero;
                    trigger onbeforePassvariable();
                    begin
                        Evaluate(ServiceItemLine."Finishing Date", StrFinishingDate);
                    end;

                    trigger OnAfterAssignVariable();
                    begin
                        Evaluate(ServiceItemLine."Finishing Date", StrFinishingDate);
                    end;
                }
                textelement(StrFinishingTime)
                {
                    MinOccurs = Zero;
                    trigger onbeforePassvariable();
                    begin
                        Evaluate(ServiceItemLine."Finishing Time", StrFinishingTime);
                    end;

                    trigger OnAfterAssignVariable();
                    begin
                        Evaluate(ServiceItemLine."Finishing Time", StrFinishingTime);
                    end;
                }
                fieldelement(LoanerNo; ServiceItemLine."Loaner No.")
                {
                    MinOccurs = Zero;
                }
                fieldelement(LocationofServiceItem; ServiceItemLine."Location of Service Item")
                {
                    MinOccurs = Zero;
                }
                fieldelement(NoofActiveFinishedAllocs; ServiceItemLine."No. of Active/Finished Allocs")
                {
                    MinOccurs = Zero;
                }
                fieldelement(NoofAllocations; ServiceItemLine."No. of Allocations")
                {
                    MinOccurs = Zero;
                }
                fieldelement(NoofPreviousServices; ServiceItemLine."No. of Previous Services")
                {
                    MinOccurs = Zero;
                }
                fieldelement(ReleaseStatus; ServiceItemLine."Release Status")
                {
                    MinOccurs = Zero;
                }
                /*fieldelement(RepairStatusCodeFilter; ServiceItemLine."Repair Status Code Filter")
                {
                    MinOccurs = Zero;
                }*/
                fieldelement(RepairStatusCode; ServiceItemLine."Repair Status Code")
                {
                    MinOccurs = Zero;
                }
                fieldelement(ResolutionCode; ServiceItemLine."Resolution Code")
                {
                    MinOccurs = Zero;
                }
                fieldelement(ResolutionComment; ServiceItemLine."Resolution Comment")
                {
                    MinOccurs = Zero;
                }
                /*fieldelement(ResourceFilter; ServiceItemLine."Resource Filter")
                {
                    MinOccurs = Zero;
                }
                fieldelement(ResourceGroupFilter; ServiceItemLine."Resource Group Filter")
                {
                    MinOccurs = Zero;
                }*/
                textelement(StrResponseDate)
                {
                    MinOccurs = Zero;
                    trigger OnBeforePassVariable();
                    begin
                        Evaluate(ServiceItemLine."Response Date", StrResponseDate);
                    end;

                    trigger OnAfterAssignVariable();
                    begin
                        Evaluate(ServiceItemLine."Response Date", StrResponseDate);
                    end;
                }
                fieldelement(ResponseTimeHours; ServiceItemLine."Response Time (Hours)")
                {
                    MinOccurs = Zero;
                }
                textelement(StrResponseTime)
                {
                    MinOccurs = Zero;
                    trigger OnBeforePassVariable();
                    begin
                        Evaluate(ServiceItemLine."Response Time", StrResponseTime);
                    end;

                    trigger OnAfterAssignVariable();
                    begin
                        Evaluate(ServiceItemLine."Response Time", StrResponseTime);
                    end;
                }
                fieldelement(ResponsibilityCenter; ServiceItemLine."Responsibility Center")
                {
                    MinOccurs = Zero;
                }
                fieldelement(SerialNo; ServiceItemLine."Serial No.")
                {
                    MinOccurs = Zero;
                }
                fieldelement(ServPriceAdjmtGrCode; ServiceItemLine."Serv. Price Adjmt. Gr. Code")
                {
                    MinOccurs = Zero;
                }
                fieldelement(ServiceItemGroupCode; ServiceItemLine."Service Item Group Code")
                {
                    MinOccurs = Zero;
                }
                fieldelement(ServiceItemLoanerComment; ServiceItemLine."Service Item Loaner Comment")
                {
                    MinOccurs = Zero;
                }

                fieldelement(ServiceOrderFilter; ServiceItemLine."Service Order Filter")
                {
                    MinOccurs = Zero;
                }
                fieldelement(ServicePriceGroupCode; ServiceItemLine."Service Price Group Code")
                {
                    MinOccurs = Zero;
                }
                fieldelement(ServiceShelfNo; ServiceItemLine."Service Shelf No.")
                {
                    MinOccurs = Zero;
                }
                fieldelement(ShiptoCode; ServiceItemLine."Ship-to Code")
                {
                    MinOccurs = Zero;
                }
                fieldelement(ShortcutDimension1Code; ServiceItemLine."Shortcut Dimension 1 Code")
                {
                    MinOccurs = Zero;
                }
                fieldelement(ShortcutDimension2Code; ServiceItemLine."Shortcut Dimension 2 Code")
                {
                    MinOccurs = Zero;
                }
                textelement(StrStartingDate)
                {
                    MinOccurs = Zero;
                    trigger OnBeforePassVariable();
                    begin
                        Evaluate(ServiceItemLine."Starting Date", StrStartingDate);
                    end;

                    trigger OnAfterAssignVariable();
                    begin
                        Evaluate(ServiceItemLine."Starting Date", StrStartingDate);
                    end;
                }
                textelement(StrStartingTime)
                {
                    MinOccurs = Zero;
                    trigger OnBeforePassVariable();
                    begin
                        Evaluate(ServiceItemLine."Starting Time", StrStartingTime);
                    end;

                    trigger OnAfterAssignVariable();
                    begin
                        Evaluate(ServiceItemLine."Starting Time", StrStartingTime);
                    end;
                }
                fieldelement(SymptomCode; ServiceItemLine."Symptom Code")
                {
                    MinOccurs = Zero;
                }
                fieldelement(VariantCode; ServiceItemLine."Variant Code")
                {
                    MinOccurs = Zero;
                }
                fieldelement(VendorItemNo; ServiceItemLine."Vendor Item No.")
                {
                    MinOccurs = Zero;
                }
                fieldelement(VendorNo; ServiceItemLine."Vendor No.")
                {
                    MinOccurs = Zero;
                }
                fieldelement(WarrantyLabor; ServiceItemLine."Warranty % (Labor)")
                {
                    MinOccurs = Zero;
                }
                /* fieldelement(WarrantyParts; ServiceItemLine."Warranty % (Parts)")
                {
                    MinOccurs = Zero;
                }
                textelement(StrWarrantyEndingDateLabor)
                {
                    MinOccurs = Zero;
                    trigger OnBeforePassVariable();
                    begin
                        Evaluate(ServiceItemLine."Warranty Ending Date (Labor)", StrWarrantyEndingDateLabor);
                    end;

                    trigger OnAfterAssignVariable();
                    begin
                        Evaluate(ServiceItemLine."Warranty Ending Date (Labor)", StrWarrantyEndingDateLabor);
                    end;
                }
                textelement(StrWarrantyEndingDateParts)
                {
                    MinOccurs = Zero;
                    trigger OnBeforePassVariable();
                    begin
                        Evaluate(ServiceItemLine."Warranty Ending Date (Parts)", StrWarrantyEndingDateParts);
                    end;

                    trigger OnAfterAssignVariable();
                    begin
                        Evaluate(ServiceItemLine."Warranty Ending Date (Parts)", StrWarrantyEndingDateParts);
                    end;
                }
                textelement(StrWarrantyStartingDateLabor)
                {
                    MinOccurs = Zero;
                    trigger OnBeforePassVariable();
                    begin
                        Evaluate(ServiceItemLine."Warranty Starting Date (Labor)", StrWarrantyStartingDateLabor);
                    end;

                    trigger OnAfterAssignVariable();
                    begin
                        Evaluate(ServiceItemLine."Warranty Starting Date (Labor)", StrWarrantyStartingDateLabor);
                    end;
                }
                textelement(StrWarrantyStartingDateParts)
                {
                    MinOccurs = Zero;
                    trigger OnBeforePassVariable();
                    begin
                        Evaluate(ServiceItemLine."Warranty Starting Date (Parts)", StrWarrantyStartingDateParts);
                    end;

                    trigger OnAfterAssignVariable();
                    begin
                        Evaluate(ServiceItemLine."Warranty Starting Date (Parts)", StrWarrantyStartingDateParts);
                    end;
                } */
                fieldelement(Description; ServiceItemLine.Description)
                {
                    MinOccurs = Zero;
                }
                fieldelement(Priority; ServiceItemLine.Priority)
                {
                    MinOccurs = Zero;
                }
                /*  fieldelement(SystemId; ServiceItemLine.SystemId)
                  {
                  }*/
                fieldelement(Warranty; ServiceItemLine.Warranty)
                {
                    MinOccurs = Zero;
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
}
