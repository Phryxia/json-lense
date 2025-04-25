# Code of Conduct

## General

- No toxic behavior
- No support for legacy browser
- Be aware of our code license: GPL
- To save everyone's precious time, please ask **question first on Issue**. After the discussion ends, create Pull Request.
- Use English to collaborate with world wide developers. You can use machine translator like [deepl](https://www.deepl.com/)
- Have fun!

## Commit Convention

- Must be [**signed commit**](https://docs.github.com/en/authentication/managing-commit-signature-verification/signing-commits).
- DO NOT CHANGE DEFAULT COMMIT MESSAGE WHEN MERGE THE BRANCH
- There is no structural convention, Just explain what you did properly in English

### Good Examples 👍

```
fix #123 - remove `foo` to reduce general
Chore: remove redundant dead code and translate legacy comment
[refactoring] JSONInspector > to generalize fake scroll feature
```

### Bad Examples 👎

```
Fix issue
refactor inspector
apply review
todo
wip
버그3 고쳤어요
纠正令人厌烦的漏洞
```

## Coding Convention

- `forGeneralVariableName`
- `PRIMITIVE_CONSTANT`
- `NonPrimitiveConstant` (Note that values of the `enum` don't have to be pascal case)
- Boolean variable name must be start with `is`
- No `default export` (unless there is proper reasons)
- Enable prettier

I don't care except aboves, but performance/behavior related changes will be reviewed strictly

If you read this document, add `i_love_collei` at the end of your pull request description.
Otherwise, your Pull Request won't be merged. You may change `collei` to your loved one.
