set db-server=sqlsrv01
set db-name=LmobileKagemaTest-8.1
set log-folder=C:\L-mobile\Integration\Log
set integration-folder=C:\L-mobile\Integration

rem Lookupcache update
SET Environment.Wget="C:\L-mobile\Integration\Wget"
REM SET LookupCacheURL=https://service.hpt.net/Lookup/RefreshLookupCache
REM SET UserToken=0000-1477602639

for /f %%f in ('dir /b "%integration-folder%\Views\"') do sqlcmd -E -S %db-server% -d %db-name% -i "%integration-folder%\Views\%%f" -o "%log-folder%\Update_Views\%%f.log"

REM sqlcmd -E -S %db-server% -d %db-name% -i "%integration-folder%\Import\I_External_User.sql" -o "%log-folder%\I_External_User.log"
sqlcmd -E -S %db-server% -d %db-name% -i "%integration-folder%\Import\I_External_ServiceOrderType.sql" -o "%log-folder%\I_External_ServiceOrderType.log"
sqlcmd -E -S %db-server% -d %db-name% -i "%integration-folder%\Import\I_External_QuantityUnit.sql" -o "%log-folder%\I_External_QuantityUnit.log"
sqlcmd -E -S %db-server% -d %db-name% -i "%integration-folder%\Import\I_External_Country.sql" -o "%log-folder%\I_External_Country.log"
sqlcmd -E -S %db-server% -d %db-name% -i "%integration-folder%\Import\I_External_Station.sql" -o "%log-folder%\I_External_Station.log"
sqlcmd -E -S %db-server% -d %db-name% -i "%integration-folder%\Import\I_External_Company.sql" -o "%log-folder%\I_External_Company.log"
sqlcmd -E -S %db-server% -d %db-name% -i "%integration-folder%\Import\I_External_Address_Company.sql" -o "%log-folder%\I_External_Address_Company.log"
sqlcmd -E -S %db-server% -d %db-name% -i "%integration-folder%\Import\I_External_Address_Installation.sql" -o "%log-folder%\I_External_Address_Installation.log"
sqlcmd -E -S %db-server% -d %db-name% -i "%integration-folder%\Import\I_External_Communication_Company.sql" -o "%log-folder%\I_External_Communication_Company.log"
sqlcmd -E -S %db-server% -d %db-name% -i "%integration-folder%\Import\I_External_Person.sql" -o "%log-folder%\I_External_Person.log"
sqlcmd -E -S %db-server% -d %db-name% -i "%integration-folder%\Import\I_External_Communication_Person.sql" -o "%log-folder%\I_External_Communication_Person.log"
sqlcmd -E -S %db-server% -d %db-name% -i "%integration-folder%\Import\I_External_Article.sql" -o "%log-folder%\I_External_Article.log"
sqlcmd -E -S %db-server% -d %db-name% -i "%integration-folder%\Import\I_External_Manufacturer.sql" -o "%log-folder%\I_External_Manufacturer.log"
sqlcmd -E -S %db-server% -d %db-name% -i "%integration-folder%\Import\I_External_InstallationType.sql" -o "%log-folder%\I_External_InstallationType.log"
sqlcmd -E -S %db-server% -d %db-name% -i "%integration-folder%\Import\I_External_Installation.sql" -o "%log-folder%\I_External_Installation.log"
sqlcmd -E -S %db-server% -d %db-name% -i "%integration-folder%\Import\I_External_ServiceCommentLine.sql" -o "%log-folder%\I_External_ServiceCommentLine.log"
sqlcmd -E -S %db-server% -d %db-name% -i "%integration-folder%\Import\I_External_CostCenter.sql" -o "%log-folder%\I_External_CostCenter.log"

REM %Environment.Wget% -q %LookupCacheURL%?token=%UserToken% -O NULL

