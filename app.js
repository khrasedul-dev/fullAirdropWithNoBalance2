const {
	Telegraf,
	Composer,
	Stage,
	session,
	BaseScene,
	WizardScene
} = require('micro-bot')
const mongoose = require('mongoose')

const userModel = require('./userModel')
const checkGroup = require('./checkGroup')


// const bot = new Telegraf('5199112586:AAH-1XFcsHlB3DOwQCFa0ZZP8g0Mys3g_Gs')

const bot = new Composer()


mongoose.connect('mongodb+srv://rasedul20:rasedul20@cluster0.hzttg.mongodb.net/telegramProject?retryWrites=true&w=majority', {
	useNewUrlParser: true,
	useUnifiedTopology: true
}).catch((e) => {
	console.log(e)
}).then((d) => console.log('Database connected')).catch((e) => console.log(e))


bot.use(session({
	property: 'user',
	getSessionKey: (ctx) => ctx.chat && ctx.chat.id,
}))


bot.action('join', ctx => {

	ctx.telegram.sendMessage(ctx.chat.id, `Task 1: \n\nPlease Join our telegram gorup (If you are already a member of our group send the word "Airdrop" as a messsage in the group, then return here and click done to continue) \n\nhttps://t.me/cryptoteddies \n\nClick done to proceed after you have joined`, {
		reply_markup: {
			inline_keyboard: [
				[{
					text: "Done",
					callback_data: "groupJoin"
				}]
			]
		}
	}).catch((e) => console.log(" Something is wrong"))
})

bot.action('groupJoin', (ctx) => {

	const data = checkGroup.find({
		userId: ctx.from.id
	})

	data.then((data) => {

		if (data.length > 0) {


			ctx.telegram.sendMessage(ctx.chat.id, `Task 2: \n\nDownload Beta https://www.cryptoteddies.com/download-beta/ \n\nClick done to next task`, {
				reply_markup: {
					inline_keyboard: [
						[{
							text: "Done",
							callback_data: "channelJoin"
						}]
					]
				}
			}).catch((e) => console.log(" Something is wrong"))

		} else {


			ctx.telegram.sendMessage(ctx.chat.id, `Task 1: \n\nPlease Join our telegram gorup (If you are already a member of our group send the word "Airdrop" as a messsage in the group, then return here and click done to continue) \n\nhttps://t.me/cryptoteddies \n\nClick done to proceed after you have joined`, {
				reply_markup: {
					inline_keyboard: [
						[{
							text: "Done",
							callback_data: "groupJoin"
						}]
					]
				}
			}).catch((e) => console.log(" Something is wrong"))
		}

	}).catch((e) => console.log("Something is wrong"))


})

const input_form = new WizardScene('input_data',
	(ctx) => {


		ctx.user.userId = ctx.from.id
		ctx.user.userName = ctx.from.first_name

		ctx.reply(`Task 3: \n\nA. Click the link: \nhttps://www.Twitter.com/cryptoteddies \n\nFollow us on Twitter \nB. Like one of our Twitter posts, make a Twitter comment and retweet our post  \n\nNote: you must retweet our post, not some other person's post \n\nWhen you are done, return here and enter your Twitter username to proceed. \n\nOur team will manually verify if you have completed this task`).catch((e) => console.log(" Something is wrong"))
		return ctx.wizard.next()
	},
	(ctx) => {

		ctx.user.twitter = ctx.update.message.text

		ctx.reply(`Task 4: \n\nA. Click the link:\nhttps://www.instagram.com/invites/contact/?i=djuf9mqsvr0a&utm_content=nd6pggz \n\nFollow us on instagram, Comment and share one of our posts there. \n\nNote you must comment and share our post, not some other person's post \n\nWhen you are done, return here and enter your instagram username to proceed. \n\nOur team will manually verify if you have completed this task`).catch((e) => console.log(" Something is wrong"))
		return ctx.wizard.next()
	},
	(ctx) => {

		ctx.user.instagram = ctx.update.message.text

		ctx.reply(`Task 5: \n\nAdd Your Enjin Collectible wallet address`).catch((e) => console.log(" Something is wrong"))
		return ctx.wizard.next()
	},
	(ctx) => {

		ctx.user.ejin = ctx.update.message.text

		ctx.reply(`Task 6: \n\nAdd Your Crypto Teddies Username`).catch(() => console.log(" Something is wrong"))
		return ctx.wizard.next()
	},
	(ctx) => {

		const data = userModel.find({
			userId: ctx.from.id
		})

		data.then((data) => {


			if (data.length > 0) {

				const ref_id = parseInt(data[0].referrer_id)

				const inputData = {
					twitter: ctx.user.twitter,
					instagram: ctx.user.instagram,
					ejin: ctx.user.ejin,
					teddies_username: ctx.update.message.text,
					ref_link: "https://t.me/"+ctx.botInfo.username+"?start="+ctx.from.id,
					referral_count: '0'
				}


				const data2 = userModel.updateOne({
					userId: ctx.from.id
				}, inputData)

				data2.then((data) => {

					const data3 = userModel.find({
						userId: ref_id
					})

					data3.then((data) => {


						const ref_count = parseInt(data[0].referral_count)


						const update_ref = {
							referral_count: ref_count + 1
						}


						const data4 = userModel.updateOne({
							userId: ref_id
						}, update_ref)

						data4.then((data) => {

							ctx.telegram.sendMessage(ctx.from.id, "Account Info:\n\nName - " + ctx.from.first_name + "\nTeddy username - " + ctx.update.message.text + "\nReferral Users - 0 \n\nReferral Link -\n\n (Tap to copy your link) \n\n`https://t.me/" + ctx.botInfo.username + "?start=" + ctx.from.id + "`\n\nShare your referral links with your friends on Telegram, WhatsApp, Facebook, and Twitter and tell them about this airdrop. When they join this contest through your referral link, your referral Users count . Good luck", {
								reply_markup: {
									inline_keyboard: [
										[{
											text: "Refresh",
											callback_data: "start"
										}]
									]
								},
								parse_mode: "Markdown"
							}).catch((e) => console.log(" Something is wrong"))


						}).catch((e) => console.log("Something is wrong"))

					})


				}).catch((e) => console.log("Something is wrong"))


			} else {

				console.log(ctx.user)

				const inputData = new userModel({
					userId: ctx.from.id,
					name: ctx.from.first_name,
					twitter: ctx.user.twitter,
					instagram: ctx.user.instagram,
					ejin: ctx.user.ejin,
					teddies_username: ctx.update.message.text,
					referral_count: '0',
					ref_link: "https://t.me/"+ctx.botInfo.username+"?start="+ctx.from.id
				})

				inputData.save((e) => {

					if (e) {
						throw e
					} else {

						ctx.telegram.sendMessage(ctx.from.id, "Account Info:\n\nName - " + ctx.from.first_name + "\nTeddy username - " + ctx.update.message.text + "\nReferral Users - 0 \n\nReferral Link - \n\n (Tap to copy your link) \n\n `https://t.me/" + ctx.botInfo.username + "?start=" + ctx.from.id + "`\n\nShare your referral links with your friends on Telegram, WhatsApp, Facebook, and Twitter and tell them about this airdrop. When they join this contest through your referral link, your referral Users count . Good luck", {
							reply_markup: {
								inline_keyboard: [
									[{
										text: "Refresh",
										callback_data: "start"
									}]
								]
							},
							parse_mode: "Markdown"
						}).catch((e) => console.log(" Something is wrong"))


					}
				})
			}

		}).catch((e) => console.log("Something is wrong"))


		return ctx.scene.leave()
	}
)


const stage = new Stage([input_form], {
	sessionName: 'user'
})

bot.use(stage.middleware())


bot.action('channelJoin', Stage.enter('input_data'))


bot.start((ctx) => {

	const ref = ctx.startPayload

	const data = userModel.find({
		userId: ctx.from.id
	})


	data.then((data) => {

		if (data.length > 0) {

			const wallet = data[0].wallet
			const r = data[0].referral_count


			ctx.telegram.sendMessage(ctx.from.id, "Account Info:\n\nName - " + ctx.from.first_name + "\nWallet Address - " + wallet + "\nReferral Users - " + r + " \n\nReferral Link - \n\n (Tap to copy your link) \n\n **`https://t.me/" + ctx.botInfo.username + "?start=" + ctx.from.id + "`**\n\nShare your referral links with your friends on Telegram, WhatsApp, Facebook, and Twitter and tell them about this airdrop. When they join this contest through your referral link, your referral Users count . Good luck", {
				reply_markup: {
					inline_keyboard: [
						[{
							text: "Refresh",
							callback_data: "start"
						}]
					]
				},
				parse_mode: "Markdown"
			}).catch((e) => console.log(" Something is wrong"))


		} else {


			if (ref.length > 0) {

				const inputData = new userModel({
					userId: ctx.from.id,
					name: ctx.from.first_name,
					referrer_id: ref,
					referral_count: 0
				})

				const data = inputData.save()

				data.then((data) => {


					ctx.telegram.sendMessage(ctx.chat.id, `Hello ${ctx.from.first_name}, \nWelcome to Teddies Share crypto bot.\n\nPlease complete all task to join our airdrop \n\nClick the start button below to join the contest.`, {
						reply_markup: {
							inline_keyboard: [
								[{
									text: "Start",
									callback_data: "join"
								}]
							]
						}
					}).catch((e) => console.log(" Something is wrong"))


				}).catch((e) => console.log("Something is wrong "))


			} else {

				ctx.telegram.sendMessage(ctx.chat.id, `Hello ${ctx.from.first_name}, \nWelcome to Teddies Share crypto bot.\n\nPlease complete all task to join our airdrop \n\nClick the start button below to join the contest.`, {
					reply_markup: {
						inline_keyboard: [
							[{
								text: "Start",
								callback_data: "join"
							}]
						]
					}
				}).catch((e) => console.log(" Something is wrong"))
			}

		}


	}).catch((e) => ctx.reply("Please try again"))

})


bot.action("start", (ctx) => {

	const data = userModel.find({
		userId: ctx.from.id
	})
	data.then((data) => {
		const wallet = data[0].wallet
		const r = data[0].referral_count


		ctx.telegram.sendMessage(ctx.from.id, "Account Info:\n\nName - " + ctx.from.first_name + "\nWallet Address - " + wallet + "\nReferral Users - " + r + " \n\nReferral Link -\n\n (Tap to copy your link) \n\n **`https://t.me/" + ctx.botInfo.username + "?start=" + ctx.from.id + "`**\n\nShare your referral links with your friends on Telegram, WhatsApp, Facebook, and Twitter and tell them about this airdrop. When they join this contest through your referral link, your referral Users count . Good luck", {
			reply_markup: {
				inline_keyboard: [
					[{
						text: "Refresh",
						callback_data: "start"
					}]
				]
			},
			parse_mode: "Markdown"
		}).catch((e) => console.log(" Something is wrong"))
	}).catch((e) => ctx.reply("Please try with /start"))
})


bot.on('new_chat_members', (ctx) => {

	const data = checkGroup.find({
		userId: ctx.from.id
	})

	data.then((data) => {

		if (data.length > 0) {
			console.log("User Already Added")
		} else {

			const data = new checkGroup({
				userId: ctx.from.id
			})
			const d = data.save()
			d.catch((e) => console.log("Something is wrong"))
		}

	}).catch((e) => console.log("Something is wrong"))

})


bot.command('ref_link',(ctx)=>{
	userModel.find({userId: ctx.from.id})
	.then((data)=>{
		if(data.length > 0){
			ctx.telegram.sendMessage(ctx.chat.id , " You referral link is:\n `"+data[0].ref_link+"`" ,{
				parse_mode: 'Markdown'
			}).catch((e)=>console.log("Ref link : group error"))
		}else{
			ctx.telegram.sendMessage(ctx.chat.id , "Please join our airdrop first \nhttps://t.me/crypto_teddis_share34_bot").catch((e)=>console.log(" No Ref link : group error"))
		}
	})
})

bot.command('ref_count',(ctx)=>{
	console.log("test")

	userModel.find({userId: ctx.from.id})
	.then((data)=>{
		if(data.length > 0){
			ctx.telegram.sendMessage(ctx.chat.id , "You referral count is: `"+data[0].referral_count+"`" ,{
				parse_mode: 'Markdown'
			}).catch((e)=>console.log("Ref count : group error"))
		}else{
			ctx.telegram.sendMessage(ctx.chat.id , "Please join our airdrop first \nhttps://t.me/crypto_teddis_share34_bot").catch((e)=>console.log("NO Ref count : group error"))
		}
	})
})


bot.on('text', (ctx) => {

	const message = ctx.update.message.text

	const r = /Airdrop/gi

	if (message.match(r)) {

		const data = checkGroup.find({
			userId: ctx.from.id
		})

		data.then((data) => {

			if (data.length > 0) {
				console.log("User Already Added")
			} else {

				const data = new checkGroup({
					userId: ctx.from.id
				})
				const d = data.save()
				d.catch((e) => console.log("Something is wrong"))
			}

		}).catch((e) => console.log("Something is wrong"))

	}

})







module.exports = bot
