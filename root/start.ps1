# Start JUS Calculator — run this from the jus-calculator directory

Write-Host "Installing backend dependencies..." -ForegroundColor Cyan
Set-Location backend
pip install -r requirements.txt --quiet

Write-Host "`nStarting FastAPI backend on http://localhost:8000 ..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; uvicorn main:app --reload"

Set-Location ..\frontend
Write-Host "Starting React frontend on http://localhost:5173 ..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; npm run dev"

Write-Host "`nBoth servers are starting. Open http://localhost:5173 in your browser." -ForegroundColor Yellow
