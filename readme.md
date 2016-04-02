Fishy Boids
===========

A simulation of flocking as defined by Craig Reynolds, see https://en.wikipedia.org/wiki/Flocking_(behavior)

This is a typescript project, but the processed javascript is included in the repository for ease of deployment. 

Building
--------

Requirements:
* nodejs / npm - required to install the following
* typescript
* typings 

1. typings install - This goes and installs required typescript definitions
2. tsc - This will build and compile into js/app.js which is referenced by index.html
3. Serve it with some http server e.g. python -m http.server