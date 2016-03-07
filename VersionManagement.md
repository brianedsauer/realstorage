# Guarantees #

## Compatibility ##

Using a major.minor.micro scheme, I promise to do my best to make sure that all micro versions are fully backwards-compatible within the same major.minor branch except when a bug fix calls for changing semantics. I promise that minor versions will not remove features. There are no promises for major versions.


## Maintenance ##

The last released major.minor version released will receive bug fixes.  All other previous versions will no longer be actively maintained.


# Version Management in Hg #

Thanks to [Mercurial's](http://mercurial.selenic.com/) support for named branches and tags, I have tried to come up with a reasonable way to manage how the state of code in the source repository is delineated and communicated to others. You do not need to be an advanced user of Mercurial to be able to use it in order to always have the most up-to-date, stable code for whatever version of realStorage you care to have.

But before you continue any further, you need to understand how to use URLs when cloning. In Mercurial most everything revolves around changesets. One can take a simplified view of tags and branches as simply a named label for a revision. And this simlified view is handy when you realize that a revision can be specified at the end of the a URL to be cloned. For instance, if you want to clone realStorage so that you always have the most up-to-date revision for 1.0.x, you can do:

```
hg clone https://realstorage.googlecode.com/hg/#1.0 realstorage1.0
```

That will give you a cloned repository that is tied to the most up-to-date revision for 1.0. And this applies to whether 1.0 is a branch or a tag (and your repository will be updated accordingly if 1.0 changes from e.g. a tag to a branch). This allows you to control what version of realStorage you use in your own repository.

## Naming ##

Tags or branches will always exist for every major.minor release. That means if you wanted the latest release of the 1.0 branch -- whether it be 1.0.0 or 1.0.1 -- then you can clone `https://realstorage.googlecode.com/hg/#1.0` knowing that only the micro version will change.

Major.minor.micro names will also be provided but be of no interest to users. They are there merely to help keep track of any changes between the last micro release for things such as release notes.

## The default Branch ##

The main branch in the repository is used for development. While all precautions will be taken to make sure that no broken code gets checked into the default branch, no promises will be made that all tests will be passing or that the code has been fully tested.