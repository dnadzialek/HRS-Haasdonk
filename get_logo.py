import urllib.request
import re

url = 'https://www.google.com/search?q=Kvk+Svelta+Melsele+logo+wikipedia+png&tbm=isch'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
html = urllib.request.urlopen(req).read().decode('utf-8')

# extract image URLs
urls = re.findall(r'<img.*?src="(http.*?)"', html)
if urls:
    # 0 is usually a tracking pixel or google logo in tbm=isch, 1 is the first result
    urllib.request.urlretrieve(urls[1], 'public/images/melsele.png')
    print('Downloaded', urls[1])
else:
    print('No image found')
