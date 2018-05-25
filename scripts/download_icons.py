import requests
import os

if __name__ == '__main__':
  urls = [
    'https://elwiki.net/wiki/images/5/5b/ElrianodeTopRed1.png',
    'https://elwiki.net/wiki/images/f/f7/ElrianodeTopBlue1.png',
    'https://elwiki.net/wiki/images/c/cb/ElrianodeTopPurple1.png',

    'https://elwiki.net/wiki/images/0/0e/ElrianodeTopRed2.png',
    'https://elwiki.net/wiki/images/f/f9/ElrianodeTopBlue2.png',
    'https://elwiki.net/wiki/images/d/d6/ElrianodeTopPurple2.png',

    'https://elwiki.net/wiki/images/2/27/ElrianodeTopRed3.png',
    'https://elwiki.net/wiki/images/0/02/ElrianodeTopBlue3.png',
    'https://elwiki.net/wiki/images/1/1d/ElrianodeTopPurple3.png',

    'https://elwiki.net/wiki/images/d/db/ElrianodeTopRed4.png',
    'https://elwiki.net/wiki/images/3/33/ElrianodeTopBlue4.png',
    'https://elwiki.net/wiki/images/3/3c/ElrianodeTopPurple4.png',

    'https://elwiki.net/wiki/images/7/70/ElrianodeBottomRed1.png',
    'https://elwiki.net/wiki/images/d/d0/ElrianodeBottomBlue1.png',
    'https://elwiki.net/wiki/images/4/41/ElrianodeBottomPurple1.png',

    'https://elwiki.net/wiki/images/e/e5/ElrianodeBottomRed2.png',
    'https://elwiki.net/wiki/images/7/7d/ElrianodeBottomBlue2.png',
    'https://elwiki.net/wiki/images/f/f5/ElrianodeBottomPurple2.png',

    'https://elwiki.net/wiki/images/e/ea/ElrianodeBottomRed3.png',
    'https://elwiki.net/wiki/images/e/ed/ElrianodeBottomBlue3.png',
    'https://elwiki.net/wiki/images/7/74/ElrianodeBottomPurple3.png',

    'https://elwiki.net/wiki/images/c/c7/ElrianodeBottomRed4.png',
    'https://elwiki.net/wiki/images/9/91/ElrianodeBottomBlue4.png',
    'https://elwiki.net/wiki/images/3/30/ElrianodeBottomPurple4.png',

    'https://elwiki.net/wiki/images/9/94/ElrianodeGlovesRed1.png',
    'https://elwiki.net/wiki/images/1/12/ElrianodeGlovesBlue1.png',
    'https://elwiki.net/wiki/images/f/f1/ElrianodeGlovesPurple1.png',

    'https://elwiki.net/wiki/images/c/c4/ElrianodeGlovesRed2.png',
    'https://elwiki.net/wiki/images/8/8f/ElrianodeGlovesBlue2.png',
    'https://elwiki.net/wiki/images/0/0d/ElrianodeGlovesPurple2.png',

    'https://elwiki.net/wiki/images/f/fb/ElrianodeGlovesRed3.png',
    'https://elwiki.net/wiki/images/9/91/ElrianodeGlovesBlue3.png',
    'https://elwiki.net/wiki/images/c/c0/ElrianodeGlovesPurple3.png',

    'https://elwiki.net/wiki/images/c/ce/ElrianodeGlovesRed4.png',
    'https://elwiki.net/wiki/images/1/1c/ElrianodeGlovesBlue4.png',
    'https://elwiki.net/wiki/images/6/65/ElrianodeGlovesPurple4.png',

    'https://elwiki.net/wiki/images/e/e6/ElrianodeShoesRed1.png',
    'https://elwiki.net/wiki/images/6/60/ElrianodeShoesBlue1.png',
    'https://elwiki.net/wiki/images/7/76/ElrianodeShoesPurple1.png',

    'https://elwiki.net/wiki/images/0/0b/ElrianodeShoesRed2.png',
    'https://elwiki.net/wiki/images/b/b5/ElrianodeShoesBlue2.png',
    'https://elwiki.net/wiki/images/9/9a/ElrianodeShoesPurple2.png',

    'https://elwiki.net/wiki/images/3/3a/ElrianodeShoesRed3.png',
    'https://elwiki.net/wiki/images/b/b5/ElrianodeShoesBlue3.png',
    'https://elwiki.net/wiki/images/7/7c/ElrianodeShoesPurple3.png',

    'https://elwiki.net/wiki/images/8/83/ElrianodeShoesRed4.png',
    'https://elwiki.net/wiki/images/2/28/ElrianodeShoesBlue4.png',
    'https://elwiki.net/wiki/images/e/e7/ElrianodeShoesPurple4.png',  
  ]

  path = 'client/src/images'
  for url in urls:
    file_name = url.rsplit('/', 1)[-1] 
    with open(os.path.join(path, file_name), 'wb') as file:
      response = requests.get(url)
      file.write(response.content)
