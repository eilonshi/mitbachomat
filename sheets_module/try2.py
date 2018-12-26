import gspread
from oauth2client.service_account import ServiceAccountCredentials

scope = ['https://spreadsheets.google.com/feeds',
         'https://www.googleapis.com/auth/drive']

credentials = ServiceAccountCredentials.from_json_keyfile_name('client_secret.json', scope)

gc = gspread.authorize(credentials)

wks = gc.open('מטבחומט - מצב המטבחון')

def add_product_push(product_name, date_and_time,push_button_number,value):
    sheet = wks.worksheet(product_name)
    data = sheet.get_all_values()
    cell_to_add = len(data)+1
    sheet.update_acell('A'+str(cell_to_add),date_and_time)
    sheet.update_acell('B' + str(cell_to_add),'button'+str(push_button_number))
    sheet.update_acell('C' + str(cell_to_add),int(sheet.acell('C'+str(cell_to_add-1)).value)+value)

add_product_push('גבנצ','15/9/19',5,6000000000)
