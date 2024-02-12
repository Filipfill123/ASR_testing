import setuptools
import os

kwargs = {}

if os.path.isfile("requirements.txt"):
    with open('requirements.txt') as f:
        kwargs["install_requires"] = f.read().splitlines()

setuptools.setup(
    name="ASR Testing",
    version="1.0",
    author="Filip Polák",
    author_email="polakf@kky.zcu.cz",
    description="Example dialog for testing ASR by TTS",
    url="https://dialogs.kky.zcu.cz/asrtesting/index.html",
    data_files=[("static",        ["src/index.html",  "src/obrazek_barevny.jpg"]), 
                ("static/css",    [ "src/css/bootstrap.min.css", "src/css/misc.css"]),
                ("static/js",     [ "src/js/bootstrap.min.js", "src/js/control.js", "src/js/jquery-1.11.0.min.js"])
                ],
    py_modules=["testing"],
    python_requires='>=3.7',
    **kwargs
)
