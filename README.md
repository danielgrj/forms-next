This project was bootstrapped with
[`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting started

To run the project locally you need Docker and docker-compose

1. Download and install [Docker Desktop for mac](https://docs.docker.com/docker-for-mac/install/)

2. Clone the following git repository

3. Inside the folder run the following command

```sh
docker-compose up
```

If you have problesm with docker, please install the dependencies manually.

```sh
# graphql-api
npm install
# react-client
yarn install
```

## Docker services ports

The docker-compose file sets up 2 services the postgress database and the next server every one of
them is already configured to access one another but if you need direct access to any of them, the
endpoints are the following:

```
Postgress DB http://localhost:5432
Next app http://localhost:3000
```

## Deployment

To deploy the project you need the
[Elastic Beanstalk CLI](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/eb-cli3.html). After
installing it using the [setup scripts](https://github.com/aws/aws-elastic-beanstalk-cli-setup/) add
your IAM authorization .pem file to your `~/.ssh` folder.

1. Init the app

```sh
eb init
```

Chose the correct project and region. The CLI should create a `config.yml` file in
`./.elasticbeanstalk`. This should never be commited to the git repository.

2. Build the app

You need to build the app before deploying it. Remember you should only deploy the `main` branch to
prod.

```sh
git checkout main
git pull
npm run build
```

3. Deploy the app

```sh
eb deploy
```

## Code guidelines

### Branches

This project will use the Gitflow workflow so nothing will be push directly to master, every feature
will have its on branch.
[See more.](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow)

The nomenclature will be the following:

- `master`
- `develop_staging`
- `feature/my-awesome-feature`
- `fix/some-useful-fix`
- `hotfix/something-that-should-be-fix-in-production-asap`

### Eslint and prettier

This project use the following eslint presets:

```
"prettier/react",
"airbnb",
"react-app",
"plugin:prettier/recommended"
```

The prettier rules are the following.

```javascript
{
  "arrowParens": "avoid",
  "bracketSpacing": true,
  "htmlWhitespaceSensitivity": "css",
  "insertPragma": false,
  "printWidth": 100,
  "proseWrap": "always",
  "quoteProps": "as-needed",
  "requirePragma": false,
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "all",
  "useTabs": false
}
```

### Husky

Husky is a tool that makes easier to use git hooks to prevent bad commits or pushes. Simply put it
runs a script before the commit and if it failed the commit will be unsuccessful.
[To know more.](https://github.com/typicode/husky)

In this project this is used to check there is no errors with eslint or the tests and format the
files with prettier before a commit, if eslint or prettier can't fix the issue automatically you
need to do it manually.

If for whatever reason you need to make a commit bypassing the tests you can add `--no-verify` to
your command, but this is highly discourage.

Current hooks:

```json
{
  "hooks": {
    "pre-commit": "npm run check-types && lint-staged"
  }
}
```

### Folder Structure

The project has the following folder structure

```
 ├── package.json
 ├── public
 ├── components
 ├── models
 ├── styles
 ├── tests
 └── pages
      ├── api
      │   └── form-answer.js
      ├── _app.js
      └──index.js
```

## Components

For the functional components it's recommended using arrow functions to avoid the unnecesary use of
`return`;

```javascript
const Component = () => (
  <div>
    <span>Our awesome component</span>
  </div>
)

export default Component
```

It's encouraged to use stateless components whenever is posible, but if you need to use state inside
your component you should use hooks, instead of classes.

```javascript
import React, { useState } from 'react'

const StatefulComponent = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button onClick={() => setIsOpen(!isOpen)}>Open</button>
      <Collapse isOpen={isOpen}>Example text</Collapse>
    </>
  )
}
```

### Folder structure

Inside this folder will be the components we will reuse all around the application, buttons,
navbars, inputs, etc.

As a component can be quite complex and have more than one file it's necessary to make a folder per
component and include an index.js file to make it easy to import and use in other parts of the
application.

Every component should have its own `__tests__` and `assets` folders.

So we should have the next folder structure:

```
 ├── <ComponentName>.js
 ├── <ComponentName>Wrapper.js *
 ├── index.js
 ├── assets *
 └── __tests__
```

and the index file should look like this:

```javascript
import Button from './Button'

export default Button
```

That makes it easier to import and use, it doesnt matter if we have two files or more inside our
folder, for example Button and ButtonWrapper, we will be able to get the right thing using:

```javascript
import Button from '@src/components/Button'
```

The files and folders with a `*` are optional and only should be add if the are necessary. The
component Wrapper should be use to separate the logic of the graphql queries from the UI. We could
say the Wrapper shoul be the smart components and the `<ComponentName>.js` files sould be the dumb
components. To better undestand this approach you shoul read
[this post by Dan Abramov](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0)

### Styling

All the colors and fonts will be written in its own file and import when they're needed. This will
make easy to change the look of the app.

For styling we will use styled-components because the library let us use Sass, it has and easy way
to dynamically change the style of the components and we can extend from previous components.

```javascript
import styled from 'styled-component'
import colors from '@src/styles/colors'

const AwesomeButton = styled.button`
  border: none;
  background: none;
  border-radius: 5px;
  background-color: ${colors.red};
`

const AwesomeBlueButton = styled(AwesomeButton)`
  background-color: ${colors.blue};
`
```

Remember to pass the className prop to your components so it can be extended with styled-components.

```javascript
const ComponentToBeStyled = ({ className }) => (
  <div className={className}>
    <span>Example text</span>
  </div>
)
```

## Testing

Jest and the react testing library will be used for testing, the number and types of test are
completely up to you, but every component, should have at least a snapshot test.

Remember every component will have its own `__tests__` folder where every test file will be. The
structure of the tests will be the following:

```javascript
import React from 'react'
import { render } from '@testing-library/react'

import ComponentToTest from '../ComponentToTest'

describe('<ComponentToTest />', () => {
  describe('render()', () => {
    it('should match the snapshot', () => {
      const { asFragment } = render(<ComponentToTest />)
      expect(asFragment()).toMatchSnapshot()
    })
  })
})
```
