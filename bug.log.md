# cases unpassed

- unpassed when `copy = false`

``` shell
1) Object
       miss prop
         should guarantee without error:

      AssertionError: expected true to equal false
      + expected - actual


      -true
      +false

  2) Object
       length wrong
         should guarantee without error:

      AssertionError: expected true to equal false
      + expected - actual

      -true
      +false
```

- unpassed when `copy = true`

``` shell
1) Object
       length wrong
         should guarantee without error:


      AssertionError: expected true to equal false
      + expected - actual

      -true
      +false
```
