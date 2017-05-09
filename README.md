# Building Plan

The application for showing interactive building's plans.

## Preparing the environment

Make all of the following prerequisites are installed on the development machine:

- Node.js and npm package manager

## Cloning the repository
  
```bash
bitpool-os$: git clone https://github.com/DefeNder93/building-plan.git
bitpool-os$: git checkout master
```

## Running the application

```bash
root-dir$: npm instll -g json-server
root-dir$: npm update
root-dir$: node server.js
root-dir$: json-server --watch db/db.json
```

And open http://localhost:9000
