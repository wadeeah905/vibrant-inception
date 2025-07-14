xmlport 50081 ServiceCommentLine
{
    FormatEvaluate = Xml;
    Format = Xml;
    UseDefaultNamespace = true;
    schema
    {


        textelement(ServiceCommentLineXML)
        {

            MinOccurs = Zero;

            tableelement(ServiceCommentLine; "Service Comment Line")
            {

                XmlName = 'ServiceCommentLine';
                MinOccurs = Zero;
                AutoUpdate = true;
                AutoSave = true;
                fieldattribute(TableName; ServiceCommentLine."Table Name")
                {

                }
                fieldattribute(TableSubtype; ServiceCommentLine."Table Subtype")
                {
                }
                fieldattribute(No; ServiceCommentLine."No.")
                {
                }
                fieldattribute(Type; ServiceCommentLine.Type)
                {
                }
                fieldattribute(TableLineNo; ServiceCommentLine."Table Line No.")
                {
                }

                fieldattribute(Date; ServiceCommentLine.Date)
                {
                }
                fieldattribute(Monteur; ServiceCommentLine.Monteur)
                {
                }

                textelement(StrLineNo)
                {
                    MinOccurs = Zero;

                    trigger OnAfterAssignVariable()
                    var
                        RecLCommentLine: Record "Service Comment Line";
                    begin
                        IF StrLineNo = '' then begin
                            RecLCommentLine.SetRange("Table Name", ServiceCommentLine."Table Name");
                            RecLCommentLine.SetRange("Table Subtype", ServiceCommentLine."Table Subtype");
                            RecLCommentLine.SetRange("No.", ServiceCommentLine."No.");
                            RecLCommentLine.SetRange(Type, ServiceCommentLine.Type);
                            //  RecLCommentLine.SetRange("Table Line No.", ServiceCommentLine."Table Line No.");
                            IF RecLCommentLine.FindLast() then
                                ServiceCommentLine."Line No." := RecLCommentLine."Line No." + 10000
                            else
                                ServiceCommentLine."Line No." := 10000;
                        end
                        else
                            Evaluate(ServiceCommentLine."Line No.", StrLineNo);

                    end;
                }

                textelement(StrComment)
                {
                    TextType = BigText;


                    trigger OnAfterAssignVariable()
                    var
                        StartPos: Integer;
                        CharNumber: Integer;
                        strCommentLength: Integer;
                        SplitedTextLength: Integer;
                        SplitedLinecounter: Integer;
                        SplitedCommentPart: Text[80];
                        RemainingCommentpart: text;
                        RecLSplitedCommentLine: Record "Service Comment Line";
                    begin
                        /* strCommentLength := StrComment.Length();
                         SplitedTextLength := 0;
                         IF strCommentLength > 80 then begin
                             StartPos := 1;
                             CharNumber := 80;
                             StrComment.GetSubText(ServiceCommentLine.Comment, 1, 80);
                             StrComment.GetSubText(RemainingCommentpart, 81, StrComment.Length() - 80);
                             while (strlen(RemainingCommentpart) > 0) do begin
                                 SplitedCommentPart := '';
                                 SplitedCommentPart := CopyStr(RemainingCommentpart, StartPos, CharNumber);
                                 SplitedTextLength := StrLen(SplitedCommentPart);
                                 IF StrLen(RemainingCommentpart) - SplitedTextLength > 0 then begin
                                     RemainingCommentpart := CopyStr(RemainingCommentpart, SplitedTextLength + 1, StrLen(RemainingCommentpart) - SplitedTextLength);
                                     SplitedLinecounter += 1;
                                     RecLSplitedCommentLine.Init();
                                     RecLSplitedCommentLine.TransferFields(ServiceCommentLine);
                                     RecLSplitedCommentLine.Comment := SplitedCommentPart;
                                     RecLSplitedCommentLine."Line No." := ServiceCommentLine."Line No." + SplitedLinecounter;
                                     RecLSplitedCommentLine.Insert();
                                 end
                                 else begin
                                     SplitedLinecounter += 1;
                                     RecLSplitedCommentLine.Init();
                                     RecLSplitedCommentLine.TransferFields(ServiceCommentLine);
                                     RecLSplitedCommentLine.Comment := SplitedCommentPart;
                                     RecLSplitedCommentLine."Line No." := ServiceCommentLine."Line No." + SplitedLinecounter;
                                     RecLSplitedCommentLine.Insert();
                                     RemainingCommentpart := '';
                                 end;
                             end;
                         end
                         else*/
                        if StrComment.Length() > 0 then
                            StrComment.GetSubText(ServiceCommentLine.Comment, 1, StrComment.Length());
                    end;
                }

            }
        }
    }
}
