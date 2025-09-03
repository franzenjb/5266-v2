#!/usr/bin/env python3
import openpyxl

# Open the Statistics Excel file
wb = openpyxl.load_workbook('/Users/jefffranzen/5266-v2/planning-docs/Disaster5266CollectionTool-Statistics.xlsx', data_only=True)

# Extract the CountyStateRegions_21 sheet
sheet = wb['CountyStateRegions_21']

print("First 10 rows of CountyStateRegions_21:")
print("-" * 80)

for row in range(1, 11):
    row_data = []
    for col in range(1, 5):
        value = sheet.cell(row=row, column=col).value
        row_data.append(str(value) if value else 'None')
    print(f"Row {row}: Col1='{row_data[0]}' | Col2='{row_data[1]}' | Col3='{row_data[2]}' | Col4='{row_data[3]}'")