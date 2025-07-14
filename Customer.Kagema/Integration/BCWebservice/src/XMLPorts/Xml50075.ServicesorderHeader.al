xmlport 50075 "Services order Header"
{
    FormatEvaluate = Xml;
    Format = Xml;
    UseDefaultNamespace = true;
    schema
    {
        textelement(ServiceOrderHeaderXML)
        {
            tableelement(ServiceHeader; "Service Header")
            {
                XmlName = 'ServiceOrderHeader';
                LinkTableForceInsert = true;
                AutoUpdate = true;
                AutoSave = true;
                MinOccurs = Zero;

                fieldelement(DocumentType; ServiceHeader."Document Type")
                {
                    MinOccurs = Zero;
                }
                fieldelement(No; ServiceHeader."No.")
                {
                    MinOccurs = Zero;
                }
                fieldelement(CustomerNo; ServiceHeader."Customer No.")
                {
                    MinOccurs = Zero;
                    FieldValidate = Yes;
                }

                fieldelement(Description; ServiceHeader.Description)
                {
                    MinOccurs = Zero;
                }


                fieldelement(ShiptoCode; ServiceHeader."Ship-to Code")
                {
                    MinOccurs = Zero;

                }
                fieldelement(SalespersonCode; ServiceHeader."Salesperson Code")
                {
                    MinOccurs = Zero;

                }
                fieldelement(ServiceOrderType; ServiceHeader."Service Order Type")
                {
                    MinOccurs = Zero;
                }


                Textelement(StrStartingDate)
                {
                    MinOccurs = Zero;
                    trigger OnBeforePassVariable();
                    begin
                        Evaluate(ServiceHeader."Starting Date", StrStartingDate);
                    end;

                    trigger OnAfterAssignVariable();
                    begin
                        Evaluate(ServiceHeader."Starting Date", StrStartingDate);
                    end;
                }
                Textelement(StrStartingTime)
                {
                    MinOccurs = Zero;
                    trigger OnBeforePassVariable();
                    begin
                        Evaluate(ServiceHeader."Starting Time", StrStartingTime);
                    end;

                    trigger OnAfterAssignVariable();
                    begin
                        Evaluate(ServiceHeader."Starting Time", StrStartingTime);
                    end;
                }
                Textelement(StrFinishingDate)
                {
                    MinOccurs = Zero;
                    trigger OnBeforePassVariable();
                    begin
                        Evaluate(ServiceHeader."Finishing Date", StrFinishingDate);
                    end;

                    trigger OnAfterAssignVariable();
                    begin
                        Evaluate(ServiceHeader."Finishing Date", StrFinishingDate);
                    end;
                }
                Textelement(StrFinishingTime)
                {
                    MinOccurs = Zero;
                    trigger OnBeforePassVariable();
                    begin
                        Evaluate(ServiceHeader."Finishing Time", StrFinishingTime);
                    end;

                    trigger OnAfterAssignVariable();
                    begin
                        Evaluate(ServiceHeader."Finishing Time", StrFinishingTime);
                    end;
                }

                fieldelement(Status; ServiceHeader.Status)
                {
                    MinOccurs = Zero;
                }

                fieldelement(KGM_Monteur; ServiceHeader.KGM_Monteur)
                {
                    MinOccurs = Zero;
                }
                fieldelement(LMNr; ServiceHeader.LMNr)
                {
                    MinOccurs = Zero;
                }
                fieldelement(DocumentDate; ServiceHeader."Document Date")
                {
                    MinOccurs = Zero;
                }
                fieldelement(LMStatus; ServiceHeader.LMStatus)
                {
                    MinOccurs = Zero;
                }

                /*   fieldattribute(StrStartingDate; ServiceHeader."Starting Date")
                  {
                      Occurrence = Optional;
                  }
                  fieldattribute(StrStartingTime; ServiceHeader."Starting Time")
                  {
                      Occurrence = Optional;
                  }
                  fieldattribute(StrFinishingDate; ServiceHeader."Finishing Date")
                  {
                      Occurrence = Optional;
                  }
                  fieldattribute(StrFinishingTime; ServiceHeader."Finishing Time")
                  {
                      Occurrence = Optional;
                  }
   */

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
