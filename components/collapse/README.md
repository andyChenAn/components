# 折叠面板组件
在PC中，我们经常会看到通过折叠面板收纳内容区域，那么这个时候就可以使用折叠面板的效果，将需要展示的面板显示出来，而不需要展示的面板内容隐藏掉。

### 介绍
这个折叠面板组件适用于PC端，一般折叠面板由两部分构成，一部分是面板标题，一部分是面板内容，当我们点击面板标题的时候，就可以展示出相应的面板内容。多次点击同一个面板标题会在展示与隐藏内容之间来回切换，目前支持两种效果，一种是普通的折叠面板效果，一种是手风琴效果，该组件兼容IE8及以上浏览器和现代浏览器。

### 用法

```javascript
new Collapse(element , options);
```
或者

```javascript
Collapse(element , options)
```
### html结构

```html
<div id="container">
    <div class="item" name="1">
        <div class="collapse-title">title</div>
        <div class="collapse-content">content</div>
    </div>
    <div>
        <div class="collapse-title">title</div>
        <div class="collapse-content">content</div>
    </div>
    <div>
        <div class="collapse-title">title</div>
        <div class="collapse-content">content</div>
    </div>
</div>
```
**在上面html代码结构中，需要注意的是，name属性是必须要有的，一般是字符串，主要是用来表示某个面板，"collapse-title"和"collapse-content"这两个类也是必须要有的，因为js代码会通过这个类来获取相应的元素，当然你也可以自定义类，不过自己要去改一下代码。**

##### 举个例子
```html
// html代码结构：
<div class="collapse-container" id="collapse-container">
    <div class="collapse-item" name="1">
        <div class="collapse-title">广州小鹏汽车科技有限公司</div>
        <div class="collapse-content">
            <div class="collapse-content-inner">小鹏互联网汽车团队成立于2014年中，于2015年1月正式注册，是一家创新型的互联网汽车科技公司。公司的主要目标是在物联网、大数据和O2O的大环境下，研发下一代智能化电动汽车。使用新的材料、制造工艺和营销模式，大胆创新、勇于探索，创造出全新的智能出行工具，用心做以产品体验为核心的互联网汽车。</div>
        </div>
    </div>
    <div class="collapse-item" name="2">
        <div class="collapse-title">华为科技有限公司</div>
        <div class="collapse-content">
            <div style="padding-bottom: 10px;">华为是全球领先的信息与通信解决方案供应商。我们围绕客户的需求持续创新，与合作伙伴开放合作，在电信网络、企业网络、消费者和云计算等领域构筑了端到端的解决方案优势。我们致力于为电信运营商、企业和消费者等提供有竞争力的 ICT 解决方案和服务，持续提升客户体验，为客户创造最大价值。目前，华为的产品和解决方案已经应用于140多个国家</div> 
        </div>
    </div>
    <div class="collapse-item" name="3">
        <div class="collapse-title">深圳市腾讯计算机系统有限公司</div>
        <div class="collapse-content">腾讯公司于1998年11月在深圳成立，是中国最早也是目前中国市场上最大的互联网即时通信软件开发商。1999年2月，腾讯正式推出第一个即时通信软件---“腾讯QQ”；并于2004年6月16日在香港联交所主板上市（股票代号700）。</div>
    </div>
    <div class="collapse-item" name="4">
        <div class="collapse-title">阿里巴巴集团</div>
        <div class="collapse-content">
            <div style="padding-bottom: 30px;">阿里巴巴集团经营多元化的互联网业务，致力为全球所有人创造便捷的网上交易渠道。自成立以来，发展了消费者电子商务、网上支付、B2B网上交易市场及云计算等领先业务。阿里巴巴集团现有25个事业部，其目标是促进一个开放、协同、繁荣的电子商务生态系统。</div>
        </div>
    </div>
</div>
```
### 使用文档
- 1、普通折叠面板效果

```javascript
var container = document.getElementById('collapse-container');
Collapse(container , {
    accordion : false,
    change : function () {
        console.log('面板发生改变');
    }
});
```
- 2、手风琴效果

```javascript
var container = document.getElementById('collapse-container');
Collapse(container , {
    accordion : true,
    change : function () {
        console.log('面板发生改变');
    }
})
```

### options参数：

参数 | 默认值 | 是否必须 | 说明
---|---|---|---
accordion | false | 否 | 是否展示手风琴效果
change | function () {} | 否 | 折叠面板发生变化时的回调