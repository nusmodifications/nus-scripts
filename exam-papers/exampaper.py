import http.client
import urllib.request
import urllib.parse

module = 'cs3230'
euzernaem = ''
parsewerd = ''

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
    #printNice(params)
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
        f = open(title, 'wb+')
        f.write(data)
        f.close()
        

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
    

if __name__ == '__main__':
    getContents()
	
