from fabric.api import local


def devel():
    local('jekyll --auto --serve')


def build():
    local('jekyll')


def deploy():
    build()
    local('rsync -rtv _site/ site@rosedu.org:uc.rosedu.org/')
