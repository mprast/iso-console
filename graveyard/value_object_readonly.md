# Readonly properties on value objects
## Feature motivation
Value objects are designed to encapsulate an object and make it so that 
it's easy to keep the object consistent when certain parts of it need 
to stay correlated (e.g. adding an edge to a graph should add an inbound 
edge to one node and an outbound edge to another node). As such mutating 
the encapsulated object should be impossible except via the setters on 
the enclosing Value Object. 

# Reason for deprecation 
Since we allow callers to access properties 
on the value object directly by intercepting get with an object proxy, 
the obvious solution is to make the type of the internal object itself 
read-only. Using Typescript's `Readonly<T>` doesn't cut the mustard tho, 
since it would still be possible to set nested properties like so: 
`myValueObj.prop1.nested = "uh oh";`. One workaround is to define a 
`ReadonlyRecursive<T>` type which propagates itself down the object tree, 
but there's no way to tell that type not to apply itself to standard 
javascript/typescript library classes (e.g. `Array`) and there were some 
deal-breaking negative consequences (e.g. we couldn't call `map` on `Array`).
It's also sometimes a convenient shorthand to be able to set properties 
on Value Objects directly, and that pathway is of course ruled out with 
all readonly properties.

# Mitigation
For now we'll just trust people not to directly set anything on the 
object (except in cases where we've made an explicit exception). If this 
is a universally applied rule, the danger becomes actually calling a 
setter you don't want (as opposed to just accidentally setting a property).
For this reason we're keeping `Mask<T>` around, even though it no longer 
makes strong guarantees about what happens to the object.

# Dead code
```typescript
export type ReadonlyRecursive<T> = {
    readonly [P in keyof T] : ReadonlyRecursive<T[P]>
}
```

```typescript
export class ValueObjectInternal<T extends {}>{
    // never assigned to; only exists to set up the type 
    // of the value object. using ReadonlyRecursive here 
    // ensures that the whole object hierarchy is readonly.
    public objectType: ReadonlyRecursive<T>;
}
```
