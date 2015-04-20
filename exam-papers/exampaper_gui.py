import http.client
import urllib.request
import urllib.parse
from tkinter import *
from tkinter import filedialog

module = euzernaem = parsewerd = destination = ''

def getContents():
    global module, euzernaem, parsewerd
    conn = http.client.HTTPSConnection('libbrs.nus.edu.sg')
    page = '/infogate/loginAction.do?execution=login'
    conn.request('GET', page)

    resp = conn.getresponse()
    conn.close()
    cookie = resp.getheader('Set-Cookie')
    sessionid = cookie[:cookie.find(';')]
    cookie = sessionid
    print(cookie)

    headers = {
        "Content-Type" : "application/x-www-form-urlencoded",
        "Cookie" : cookie
    }
    headersGet = {
        "Cookie" : cookie
    }

    params = 'userid='+euzernaem+'&password='+parsewerd+'&domain=NUSSTU&key=blankid%2BRESULT%2BEXAM%2B'+module


    conn = http.client.HTTPSConnection('libbrs.nus.edu.sg')
    conn.request("POST", page, params, headers)
    resp = conn.getresponse()
    data = str(resp.read())
    conn.close()

    conn = http.client.HTTPConnection('libbrs.nus.edu.sg:8080')
    page = '/infogate/jsp/login/success.jsp;jsessionid='+sessionid+'?exe=ResultList'
    conn.request("GET", page, params, headersGet)
    conn.close()

    conn = http.client.HTTPConnection('libbrs.nus.edu.sg:8080')
    page = '/infogate/searchAction.do?execution=ResultList'
    params = 'database=EXAM&searchstring='+module+'&d='
    conn.request("POST", page, params, headers)
    resp = conn.getresponse()
    data = resp.read()
    conn.close()

    data = str(data)
    downloadall(data, headers, headersGet)

def printNice(params):
    for key in params:
        print(str(key) + ' = ' + str(params[key]))

def downloadall(data, headers, headersGet):
    params = getParams(data)
    maxDocIndex = int(params['maxNo'])
    params['maxDocIndex'] = params['maxNo']

    for i in range(1,maxDocIndex+1):
        conn = http.client.HTTPConnection('libbrs.nus.edu.sg:8080')
        page = '/infogate/searchAction.do?execution=ViewSelectedResultListLong'
        params['preSelectedId'] = i
        params['exportids'] = i
        conn.request("POST", page, urllib.parse.urlencode(params), headers)
        resp = conn.getresponse()
        data = resp.read()
        conn.close()
        data = str(data)

        pdfIndex = data.find('View attached PDF file')
        if pdfIndex == -1:
            continue
        pdfIndex = data.rfind('href=', 0, pdfIndex)
        openquotes = data.find('"', pdfIndex)
        closequotes = data.find('"', openquotes+1)
        page = page[:page.rfind('/')+1] + data[openquotes+1:closequotes]

        titleIndex = data.find('title=', pdfIndex)
        if titleIndex == -1:
            continue
        openquotes = data.find('"', titleIndex)
        closequotes = data.find('"', openquotes+1)
        title = data[openquotes+1: closequotes]

        conn = http.client.HTTPConnection('libbrs.nus.edu.sg:8080')
        conn.request("GET", page, None, headersGet)
        resp = conn.getresponse()
        data = resp.read()

        conn.close()

        title = title[title.find('file')+5:]
        print('Writing ' + title)
        f = open(destination + '/' + title, 'wb+')
        f.write(data)
        f.close()

    updateStatus("Done!", 'success')


def getParams(data):
    start = data.find('databasenamesasstring')
    start = data.rfind('<', 0, start)
    end = data.find('<select', start)

    params = {
        'databasenamesasstring' : 'Examination Papers Database',
        'searchid':'-6901505210342489183',
        'f':'list',
        'b':'1',
        'p':'1',
        'd':'EXAM',
        'u':'dummy',
        'r':'',
        'l':'20',
        'n':'',
        'nn':'',
        'historyid':'1',
        'maxDocIndex':'11',
        'preSelectedId':'1,', #id
        'maxNo':'11',
        'sPage1':'1',
        'pageNo1':'1',
        'exportids':'1', #id
        'maxNo':'11',
        'sPage2':'1',
        'pageNo2':'1',
        'paraid[0]':'PGH2',
        'parashortname[0]':'FACU',
        'paravalue[0]':'',
        'paraid[1]':'PGH3',
        'parashortname[1]':'SUBJ',
        'paravalue[1]':'',
        'paraid[2]':'PGH5',
        'parashortname[2]':'CNAM',
        'paravalue[2]':''
    }

    start = data.find('name=', start, end)
    while start != -1:
        openquotes = data.find('"', start, end)
        closequotes = data.find('"', openquotes+1, end)
        name = data[openquotes+1:closequotes]
        start = data.find('value=', start, end)
        openquotes = data.find('"', start, end)
        closequotes = data.find('"', openquotes+1, end)
        value = data[openquotes+1:closequotes]
        params[name] = value

        #print (name + ' ==> ' + value)
        start = data.find('name=', start, end)

    return params


def askForDestination():
    global destination, destField
    destination = filedialog.askdirectory(mustexist=False, parent=top, title="Choose a destination")
    destField.delete(0)
    destField.insert(0, destination)

def startDownload():
    global module, euzernaem, parsewerd, destination
    module = moduleField.get()
    euzernaem = usernameField.get()
    parsewerd = passwordField.get()
    getContents()

def updateStatus(msg, type='normal'):
    global statusLabel
    statusLabel['text'] = msg
    if type == 'success':
        statusLabel['fg'] = 'green'
    elif type == 'error':
        statusLabel['fg'] = 'red'


root = Tk()
root.title("NUS Past Year Exam Paper Downloader")

top = Frame(root)
top.grid(row=0, column=0, padx=20, pady=20)
top.columnconfigure(0, weight=1)
top.rowconfigure(0, weight=1)

moduleLabel = Label(top, text="Module Code:")
moduleLabel.grid(row=1, column=0)
moduleField = Entry(top, bd=2, textvariable=module)
moduleField.grid(row=1, column=1, columnspan=2)

usernameLabel = Label(top, text="NUSNET ID:")
usernameLabel.grid(row=2, column=0)
usernameField = Entry(top, bd=2, textvariable=euzernaem)
usernameField.grid(row=2, column=1, columnspan=2)

passwordLabel = Label(top, text="Password:")
passwordLabel.grid(row=3, column=0)
passwordField = Entry(top, bd=2, show='*', textvariable=parsewerd)
passwordField.grid(row=3, column=1, columnspan=2)

destLabel = Label(top, text="Destination:")
destLabel.grid(row=4, column=0)
destField = Entry(top, bd=2, textvariable=destination)
destField.grid(row=4, column=1)
destButton = Button(top, text="...", command=askForDestination)
destButton.grid(row=4, column=2)

statusLabel = Label(top, text="^____^", justify=CENTER)
statusLabel.grid(row=5, columnspan=3)

startButton = Button(top, text="Start!", command=startDownload)
startButton.grid(row=6, columnspan=3)

root.mainloop()
