set db-server=sqlsrv01
set db-name=LmobileKagemaTest-8.1
set log-folder=C:\L-mobile\Integration\Log
set integration-folder=C:\L-mobile\Integration

for /f %%f in ('dir /b "%integration-folder%\Views\"') do sqlcmd -E -S %db-server% -d %db-name% -i "%integration-folder%\Views\%%f" -o "%log-folder%\Update_Views\%%f.log"

sqlcmd -E -S %db-server% -d %db-name% -i "%integration-folder%\Import\I_External_ServiceOrder.sql" -o "%log-folder%\I_External_ServiceOrder.log"
sqlcmd -E -S %db-server% -d %db-name% -i "%integration-folder%\Import\I_External_ServiceOrderTimes.sql" -o "%log-folder%\I_External_ServiceOrderTimes.log"
sqlcmd -E -S %db-server% -d %db-name% -i "%integration-folder%\Import\I_External_ServiceOrderMaterial.sql" -o "%log-folder%\I_External_ServiceOrderMaterial.log"
sqlcmd -E -S %db-server% -d %db-name% -i "%integration-folder%\Import\I_External_ServiceOrderTimePostings.sql" -o "%log-folder%\I_External_ServiceOrderTimePostings.log"