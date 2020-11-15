<!-- TOC -->

- [API：](#api)
- [url 中不能直接使用的字段：](#url-%e4%b8%ad%e4%b8%8d%e8%83%bd%e7%9b%b4%e6%8e%a5%e4%bd%bf%e7%94%a8%e7%9a%84%e5%ad%97%e6%ae%b5)
  - [pageType:](#pagetype)
  - [p](#p)
- [url 中可以直接使用的字段：](#url-%e4%b8%ad%e5%8f%af%e4%bb%a5%e7%9b%b4%e6%8e%a5%e4%bd%bf%e7%94%a8%e7%9a%84%e5%ad%97%e6%ae%b5)
  - [word](#word)
  - [order](#order)
  - [type](#type)
  - [wlt](#wlt)
  - [hlt](#hlt)
  - [ratio](#ratio)
  - [tool](#tool)
  - [s_mode](#smode)
  - [mode](#mode)
  - [scd](#scd)
  - [ecd](#ecd)
  - [blt](#blt)
  - [bgt](#bgt)

<!-- /TOC -->

# API：

```
https://www.pixiv.net/ajax/search/${pageType}/${word}?word=${word}&order=${order}&p=${p}&type=${type}&s_mode=${s_mode}&mode=${mode}&wlt=${wlt}&hlt=${hlt}&ratio=${ratio}&tool=${tool}&scd=${scd}&ecd=$(ecd)&blt=${blt}&bgt=$(bgt)
```

# url 中不能直接使用的字段：

## pageType:
- artworks  // 插画·漫画
- illustrations // 插画
- manga // 漫画
- novels  // 小说

因为 url 中显示的这些类型，与实际请求时发送的类型未必完全一致。所以需要再判断。

## p

number

1. *最多 1000 页，超过 1000 视为 1000*
2. 如果没有 p，则为第一页

# url 中可以直接使用的字段：

## word

string   

## order

- date_d  // 默认，按从新到旧
- date  // 从旧到新，可以从 url 获取

*如果 url 里没有 order 就视为 date_d*


## type
-                   //获取所有类型时，不需指定。如：插画、漫画、动图（动态插画）  插画·漫画没有这个字段
- illust            // 插画
- manga             // 漫画
- ugoira            // 动图，但其实和 illust 一样，没有单独区分动图
- illust_and_ugoira // 插画 和 动图，但其实和 illust 一样

*小说页面没有这个字段*

## wlt

number


## hlt

number


## ratio
- 0.5  // 横图
- 0   // 正方形
- -0.5  // 纵图

## tool
string

## s_mode

*搜索的精准度*

-             // 为空时是 "标签"
- s_tag_full  // 标签（完全一致）
- s_tc        // 标题，说明文字

## mode

*如果不限制，则留空*

- safe
- r18

## scd

*开始时间*

2019-10-23

## ecd

*结束时间*

2019-11-06

## blt

*收藏数量起始范围*

## bgt

*收藏数量终止范围*

*如果非会员使用收藏数标记，会被忽略*