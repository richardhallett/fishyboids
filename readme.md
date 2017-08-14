Fishy Boids
===========

A simulation of flocking as defined by Craig Reynolds, see https://en.wikipedia.org/wiki/Flocking_(behavior)

This is a typescript project, but the processed javascript is included in the repository for ease of deployment.

Demo here: https://cdn.rawgit.com/richardhallett/fishyboids/9b587f3cfd6131f143633183c73e05e40ec2cff7/index.html

Building
--------

Requirements:
* nodejs / npm
* typescript

1. tsc - This will build and compile into js/app.js which is referenced by index.html
2. Serve it with some http server e.g. python -m http.server
