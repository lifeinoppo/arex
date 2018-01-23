const nodejieba = require("nodejieba");
const D_U_protection = require('./data/D_U_protection.json');
var afinn = require('./data/AFINN-zh_cn.json');
const path = require('path');


nodejieba.load({
  userDict: path.resolve(__dirname,'data','user-words.txt'),
});

const tokenize = (input) =>{
	var seg_i = nodejieba.cut(input);
	var seg_o = [];
	for (var i in seg_i)
	{
		var it = seg_i[i].replace(/[的得着了过]$/g, '');
		if (i >= 1)
		{
			if(D_U_protection.indexOf(seg_i[i - 1] + seg_i[i]) != -1)
			{
				seg_o.pop();
				seg_o.push(seg_i[i - 1] + seg_i[i]);
			}
		}
		if(D_U_protection.indexOf(seg_i[i]) != -1)
			seg_o.push(seg_i[i])
		else if(it) seg_o.push(it);
	}
    return seg_o;
}

const sentiment = (phrase, inject, callback) => {
	// Parse arguments
    if (typeof phrase === 'undefined') phrase = '';
    if (typeof inject === 'undefined') inject = null;
    if (typeof inject === 'function') callback = inject;
    if (typeof callback === 'undefined') callback = null;

    // Merge
    if (inject !== null) {
    	afinn = Object.assign(afinn, inject);
    }

    // Storage objects
    var tokens      = tokenize(phrase),
        score       = 0,
        words       = [],
        positive    = [],
        negative    = [];

    // Iterate over tokens
    var len = tokens.length;
    while (len--) { 
        var obj = tokens[len];
        var item = afinn[obj];
        if (!afinn.hasOwnProperty(obj)) continue;

        words.push(obj);
        if (item > 0) positive.push(obj);
        if (item < 0) negative.push(obj);

        score += item;
    }

    // Handle optional async interface
    var result = {
        score:          score,
        comparative:    score / tokens.length,
        tokens:         tokens,
        words:          words,
        positive:       positive,
        negative:       negative
    };

    if (callback === null) return result;
    process.nextTick(function () {
        callback(null, result);
    });
} 

if(module.parent){
	module.exports = sentiment;
}else{
	// console.dir(sentiment('建国大业非常好看，今天过得太开心了！'));
	// console.dir(sentiment('他妈的你不想活了？', {'妈的': -10}));
	// 
	let s = `相比中小散户的“盲打误撞”，同样出身于草根，但已浸淫市场多年、财富节节攀升的牛散们则有着各自的“赚钱之道”。

　　除了精准独到的选股眼光外，市场中多年的摸爬滚打也令牛散们形成了不同的投资风格：有的无视题材、热点，坚定持有传统产业周期类个股，静待基本面转暖；有的则喜好市值相对较低的中小板、创业板个股，憧憬高成长预期；有的则执著押注基本面模糊、具有整合预期的股票，希冀潜伏收获暴利……

　　那么，今年以来，在A股市场“重价值、轻题材、严监管”的整体环境氛围下，牛散们依照自身的投资逻辑究竟又取得了怎样的成绩？一些传统的投机套利方式是否已日渐失灵？

　　徐开东：坚守“传统股”静待反转

　　在国家大力推进供给侧改革的背景下，钢铁、化工等传统产业逐步走出低谷，而近年来一直以传统产业个股为投资重心的徐开东，也慢慢步入投资收获期。

　　安阳钢铁(4.270, -0.06, -1.39%)前期披露的2017年半年报显示，牛散徐开东持股规模基本未变，以2428.83万股的持股数继续位列安阳钢铁第二大股东。

　　记者注意到，徐开东大举建仓安阳钢铁始于2015年第三季度，此后安阳钢铁虽经历了长期的低迷走势，但徐开东始终坚定持有并不断增持。值得一提的是，随着钢铁行业景气度的回升、钢价的不断上涨，钢铁板块自7月份起迎来了一波“主升浪”，安阳钢铁同期股价涨幅一度超过80%，近期虽有回落，但即使以最新股价计算，徐开东此番对安阳钢铁的长期投资目前应已由亏转盈。

　　除安阳钢铁外，在徐开东的长期持股名单中还包括青海华鼎(8.070, -0.11, -1.34%)、中煤能源(6.210, -0.03, -0.48%)、太钢不锈(5.080, -0.02, -0.39%)、东北电气(5.200, -0.05, -0.95%)（后两家尚未披露半年报）等个股，不难发现，上述标的皆为传统产业类个股，而徐开东始终对传统产业抱有信心，坚定持股，显然有其自身的投资逻辑。

　　值得一提的是，近期因投资中国联通(8.360, -0.60, -6.70%)而“一战成名”的王素芳，在今年一季度也大举建仓了太钢不锈，与徐开东分列公司第三、第四大股东（2017年一季报），颇有共同作战的意味，这也显示出两人的投资风格颇为相近。

　　周信钢：执著创业板亏多盈少

　　在市场的牛散阵营中，有一批大户醉心于对中小市值股票的投资，也在过去几年间凭借着创业板市场的高景气度赚取了不菲收益。然而，随着A股投资氛围的转变，尤其是在今年投资者更加注重价值投资的背景下，以“上证50”为代表的绩优股涨势明显，而创业板个股则呈现普跌态势。在此背景下，以周信钢为代表的、执著于中小市值股票投资的牛散们今年的“收成”也并不如愿。

　　根据上市公司目前所发半年报，周信钢截至6月末已进驻5家上市公司的十大流通股东序列，未出所料，其“上榜”公司均来自于创业板。鉴于上市公司半年报披露工作尚未完成，而若以一季报持股来计算，周信钢重点持有（进入十大流通股东）的10只股票也均是创业板公司。

　　事实上，周信钢并不讳言对中小市值股票的喜爱。早前接受媒体采访时，周信钢便坦言自己偏好小盘股，在其看来，小市值个股虽质地优劣不一，但一旦经过相关并购运作，未来成长的空间也很大。遵循这一思路，周信钢在此前几年创业板“火爆”时资产规模一路上升。然而今年“风向”一变，仍坚定持有创业板个股的周信钢的资产也难免缩水。

　　以康斯特(18.160, -0.38, -2.05%)为例，半年报显示，周信钢及其妻子李欣截至6月末仍分别持有281.58万股、190.13万股，分列第一、第二大流通股股东。而事实上，周信钢建仓康斯特始于2016年四季度，去年末，周信钢和其女周晨分别持有143.06万股和60.47万股。此后，周氏一门又不断加仓。而回看康斯特股价走势，在去年11月迎来一波短暂上涨后便持续下跌，今年以来，股价跌幅已超过了30%，周信钢一家对康斯特的投资明显处于浮亏状态。

　　此外，在创业板市场整体不景气的背景下，周信钢一家先前大规模买入的美联新材(25.700, -0.30, -1.15%)、新元科技(26.080, -0.33, -1.25%)等个股今年以来也处于下跌通道中。其中，美联新材二季度至今跌幅也超过了30%。

　　陈庆桃：押注ST 结果不如意

　　相比周信钢，另一位知名牛散陈庆桃则信奉“富贵险中求”，其对ST股执著投资的背后则有着强烈的“赌博”意味。然而，相较于几年前押注ST股所获暴利，陈庆桃今年对ST股的押注却未能如愿。

　　ST新梅(6.900, 0.17, 2.53%)8月22日发布的半年报显示，陈庆桃截至6月末已从公司十大流通股股东名单中消失。这意味着，在ST新梅暂停上市前突击买入1318.24万股的陈庆桃，已在6月份快速清仓。

　　而回看ST新梅恢复上市后的股价走势，其在6月6日恢复上市当天股价一度大涨40%，孰料尾盘却遭到巨大抛压，在短短五分钟内股价竟快速“翻绿”，此后几日公司股价也未有起色，呈整体下跌态势。这意味着，倘若陈庆桃未在上述五分钟前离场，其对ST新梅长达一年多的潜伏最终也是徒劳无功。

　　相比之下，陈庆桃早前押注的另一只暂停上市股ST常林(7.170, 0.10, 1.41%)重返A股市场时表现更差。ST常林7月31日复牌交易首日即大跌近19%，此后又连续两日跌停，至今未出现明显反弹。虽不知陈庆桃是否已减持撤退（持有1000万股），但其所持ST常林市值却显著缩水。

　　在市场人士看来，近年来，随着并购重组、退市等一系列配套政策、规定的出台，ST板块如今则日益边缘化。从实践来看，投资者出于规避潜在风险、不确定性等考虑，对ST板块的炒作也日趋谨慎，已不再盲目追涨杀跌并回归理性，ST新梅、ST常林恢复上市后的走势也证明了这一点，类似陈庆桃的投资者赚钱或越来越难。

　　蒋政一：博弈重组股前景未知

　　由于在重组股筛选方面独具慧眼，蒋政一近年来一直被视作A股市场牛散的“杰出代表”。

　　记者注意到，仅2014年以来，以蒋政一为代表的“蒋氏二人组”便已相继押中了金磊股份（旧名）、步森股份(52.880, 0.00, 0.00%)、万达信息(14.660, -0.46, -3.04%)3只具有并购重组预期的个股，潜伏成功率相当之高。而如今，蒋政一又再次押中了重组股——通达动力(24.660, 0.00, 0.00%)。

　　记者注意到，去年末尚未现身十大流通股东榜的蒋政一，凭借着灵敏的“嗅觉”于今年1月份突然买入通达动力120万股，随后，通达动力在1月23日停牌重组。而根据前期披露的重组方案，隆基泰和置业拟作价160亿元实施借壳。

　　无疑，蒋政一再次向外界展示了其挑选重组股的精准眼光。不过，此番押中通达动力，会否也像早年案例一样，为蒋政一带来丰厚的利润呢？


　　细心的投资者不难发现，随着并购重组尤其是重组上市相关政策导向的日趋严厉，上市公司实施重组已不像以往那样会轻松“过关”，交易所首先会结合其方案发出针对性的问询函，此前已有不少公司的重组方案因存在瑕疵无法回应监管部门问询而被迫终止。

　　回看通达动力本次重组，由于涉及房企借壳，其方案披露后投服中心便抛出诸多质疑。投服中心直接指出，重组上市应当参照IPO标准审核，故公司本次重组存在的两个问题，可能导致重组不能通过监管部门审核。

　　而面对着本次重组的诸多变数，蒋政一此番投资押注能否兑现成丰厚的投资收益，也充满着不确定性。

　　随着A股投资氛围的转变，在投资者更加注重价值投资，逐渐远离“炒小、炒差、炒新”的大背景下，在监管部门对并购重组从严审核监管的政策导向下，无论是痴迷投资创业板个股的周信钢，或选择投机博弈ST股的陈庆桃，还是擅长押注重组的蒋政一，以及代表着三种投资风格的牛散们，今年的股市战绩都不会太理想。而这一现象，是否该引起这类牛散乃至投资风格相近投资者的反思呢？`;
	console.dir(sentiment(s));
}