import sys
from PIL import Image
from pathlib import Path
A=Path(__file__).resolve().parent/"muestras"
ts=[int(float(x)*24) for x in sys.argv[2:]]; name=sys.argv[1]
ims=[Image.open(A/f"f_{n:05d}.jpg").resize((800,450)) for n in ts]
rows=(len(ims)+1)//2; sh=Image.new("RGB",(1600,450*rows))
for i,im in enumerate(ims): sh.paste(im,((i%2)*800,(i//2)*450))
sh.save(A/f"{name}.jpg",quality=88)
