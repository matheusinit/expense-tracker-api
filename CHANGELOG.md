# [1.0.0-alpha.2](https://github.com/matheusinit/expense-tracker-api/compare/v1.0.0-alpha.1...v1.0.0-alpha.2) (2024-10-22)

# 1.0.0-alpha.1 (2024-10-10)


### Bug Fixes

* add alpha as pre-release branch instead of main ([dedcd78](https://github.com/matheusinit/expense-tracker-api/commit/dedcd78dac0bb78e7d924fae5b62a9878da74482))
* correct mispelled word ([c1d40dd](https://github.com/matheusinit/expense-tracker-api/commit/c1d40dd2de89c79b7d102e845067a0241bb8d053))
* correct name for script to monitor vulnerabilities ([91c437b](https://github.com/matheusinit/expense-tracker-api/commit/91c437bf296a5852baeecff6f46e17c118dd26ac))
* correct name of vulnerabilities checker pipeline ([01588da](https://github.com/matheusinit/expense-tracker-api/commit/01588dafc5a0f882cb2bf95866b0a1d388afeb9f))
* let default values for ignore methods and share cookies between requests to share sessions ([3375fc8](https://github.com/matheusinit/expense-tracker-api/commit/3375fc87ac5322dc1b6ef3a9291fa5ce172219f4))
* remove npm from semantic release config ([#50](https://github.com/matheusinit/expense-tracker-api/issues/50)) ([b732186](https://github.com/matheusinit/expense-tracker-api/commit/b73218603bc4fa2bf7cd4914c7cfe1b4bc2b2460))
* specify branch to run vulnerabilities checker to ensure its runs ([18bdbf0](https://github.com/matheusinit/expense-tracker-api/commit/18bdbf0bcb623be5e9b808bf0b269b04a335d110))
* use csrf middleware to add CSRF/XSRF protection ([ca52828](https://github.com/matheusinit/expense-tracker-api/commit/ca5282828ba86a1631cf4e0de94e55cbd101c9d3))
* use helmet to apply security for HTTP response headers ([c40c0e3](https://github.com/matheusinit/expense-tracker-api/commit/c40c0e3f52f6d5a978d92c24db17b16fdf0ca779))


### Features

* ensure expense can be stored in database PostgreSQL (WIP) ([04a09ef](https://github.com/matheusinit/expense-tracker-api/commit/04a09ef80c8f1a27f363c3217905ef9fabddb13f))
* ensure helmet security HTTP headers is applied for GET /csrf-token ([7336c2b](https://github.com/matheusinit/expense-tracker-api/commit/7336c2bd24eff3261ebb07193a5d5662c420cbd8))
* ensure when all required fields is missing, then should return message error listing all fields ([d480f9c](https://github.com/matheusinit/expense-tracker-api/commit/d480f9ce9381eafaa8cd587ab78f2aef94471b0c))
* ensure when required field amount is missing, then should return bad request and error message ([0783e20](https://github.com/matheusinit/expense-tracker-api/commit/0783e205054aa84b44e4d6bb6d4a4c409cc2dd1a))
* ensure when required fields is missing, then should return bad request and message error ([0889a1c](https://github.com/matheusinit/expense-tracker-api/commit/0889a1cd16d9e80c13701d3e1116fa02ed336e82))
* expense should throw an exception if a empty description is provided ([0909bc7](https://github.com/matheusinit/expense-tracker-api/commit/0909bc751cc8db20dc657c25ad5fcd602835b13a))
* expense should throw an exception if amount equals 0 is provided ([4c838e1](https://github.com/matheusinit/expense-tracker-api/commit/4c838e1a1eeff8fa0b1f24d812cc0ed2bcd60a47))
* expense should throw an exception if amount less than 0 is provided ([9410353](https://github.com/matheusinit/expense-tracker-api/commit/9410353fe57e28c5ce5bcee44f85ead2826ada1a))
* expense should throw an exception if description length is greater than 255 is provided ([17a9563](https://github.com/matheusinit/expense-tracker-api/commit/17a956378619211c2896f8e7b7e08ced595bdedf))
* given add expense controller, when a required field is invalid, then should return bad request ([888497c](https://github.com/matheusinit/expense-tracker-api/commit/888497c61ae1e2d9834506facbfab2577bd1142d))
* given CSRF middleware, when csrf token is invalid, then should return a message error ([d8ea713](https://github.com/matheusinit/expense-tracker-api/commit/d8ea713bfe9dd3240d1b7c809eb24fbb1ee3e067))
* given CSRF middleware, when csrf token is missing, then should return a message error ([f66c410](https://github.com/matheusinit/expense-tracker-api/commit/f66c41095e014f0dc5b86570164306d9829a952d))
* given CSRF middleware, when csrf token is not provided in cookies, then should return a message error ([e7930a2](https://github.com/matheusinit/expense-tracker-api/commit/e7930a2a4ca94c84e38230260de32bb4a69a6aae))
* given expense entity, when amount equals 0 is provided, should throw an exception ([2f9f335](https://github.com/matheusinit/expense-tracker-api/commit/2f9f3356545e2b28eab4d4cfa859d64a3f51ce93))
* given view expenses controller, when an expense is added, then should return the expense in the offset pagination ([6288e2f](https://github.com/matheusinit/expense-tracker-api/commit/6288e2f9dc41807051401d3e1f699ab7c99d4287))
* given view expenses controller, when is given none parameters, then should return the expenses offset pagination ([a4d7110](https://github.com/matheusinit/expense-tracker-api/commit/a4d7110375b544f408cedc5d6629d7b45a435f0c))
* given view expenses controller, when multiple expenses is added, then should return expenses in multiple pages ([f06de63](https://github.com/matheusinit/expense-tracker-api/commit/f06de637af671be1f4079d77f8f68bce6a49f237))
* given view expenses controller, when request a specific page, then should return expenses from that page and metadata correctly ([6651bc0](https://github.com/matheusinit/expense-tracker-api/commit/6651bc0aab36dc52f0d1ea9237843d6acf667584))
* given view expenses controller, when specify the page size and page, then should return the number of expenses specifiedd by page size at specific page ([7480b2c](https://github.com/matheusinit/expense-tracker-api/commit/7480b2c9e8ac2fb4b010b6938d6cc77befcec7cc))
* given view expenses controller, when specify the page size, then should return the number of expenses specifiedd by page size ([8aee40a](https://github.com/matheusinit/expense-tracker-api/commit/8aee40ad428c3a943a51b8f14081f565b00f7e4b))
