/*global define*/
define([
    'jed'
], function(Jed) {
    var data = {"domain":"messages","locale_data":{"messages":{"20":[null,"低"],"40":[null,"中"],"60":[null,"高"],"80":[null,"紧急"],"":{"domain":"messages","plural_forms":"nplurals=2; plural=(n==1 ? 1 : 2);","lang":"zh_CN"},"Add contacts successful":[null,"添加联系人成功"],"Add contacts failure":[null,"添加联系人失败"],"Confirm Delete Contacts Title":[null,"确定删除选中的联系人？"],"Confirm Delete Contacts Content":[null,"被删除联系人创建的工单将继续保留，您可以在“已删除联系人”中查看到该联系人，并且可以进行恢复操作。"],"Delete Multiple Contacts?":[null,"被删除联系人创建的工单将继续保留，您可以在“已删除联系人”中查看到该联系人，并且可以进行恢复操作。"],"Delete Contact?":[null,"被删除联系人创建的工单将继续保留，您可以在“已删除联系人”中查看到该联系人，并且可以进行恢复操作。"],"Restore contacts successful":[null,"恢复联系人成功"],"Restore contacts failure":[null,"恢复联系人失败"],"Quick add contacts successful":[null,"添加联系人成功"],"Quick add contacts failure":[null,"添加联系人失败"],"Update contacts remarks successful":[null,"修改备注成功"],"Update contacts remarks failure":[null,"修改备注失败"],"Delete contacts successful":[null,"删除联系人成功"],"Delete contacts failure":[null,"删除联系人失败"],"Update contacts successful":[null,"修改联系人成功"],"Update contacts failure":[null,"修改联系人失败"],"Add corporations successful":[null,"添加公司成功"],"Add corporations failure":[null,"添加公司失败"],"Delete contact from the company successful":[null,"删除联系人成功"],"Delete contact from the company failure":[null,"删除联系人失败"],"Quickly add current contact to the company successful":[null,"添加联系人成功"],"Update corporations remarks successfu":[null,"修改备注成功"],"Update corporations remarks failure":[null,"修改备注失败"],"Delete corporations successful":[null,"删除公司成功"],"Delete corporations failure":[null,"删除公司失败"],"Update corporations successful":[null,"修改公司成功"],"Update corporations failure":[null,"修改公司失败"],"Delete Corporations":[null,""],"Delete Corporations And Contacts":[null,""],"Cancel":[null,"返回"],"Confirm Delete Corporations":[null,""],"Delete Multiple Corporations?":[null,""],"Delete Corporation":[null,""],"Delete Corporation And Contacts":[null,""],"Confirm Delete Corporation":[null,""],"Delete Corporation?":[null,""],"Confirm Delete Corporation Title":[null,"确定删除选中的公司？"],"Confirm Delete Corporation Content":[null,"被删除的公司将无法恢复。"],"Quick add corporations successful":[null,"快速添加公司成功"],"Quick add corporations failure":[null,"快速添加公司失败"],"Error preparing the upload":[null,"上传图片失败"],"Only supported image files.":[null,"仅支持上传图片文件"],"Not allowed zero files.":[null,"不能上传大小为0的文件"],"Reset password successful":[null,"重置密码成功"],"Reset password failure":[null,"重置密码失败"],"Update personal info successful":[null,"修改个人信息成功"],"Update personal info failure":[null,"修改个人信息失败"],"Add agent successful":[null,"创建客服成功"],"Add agent failure":[null,"创建客服失败"],"Restore agent successful":[null,"恢复客服成功"],"Restore agent failure":[null,"恢复客服失败"],"Invitation agent successful":[null,"邀请客服成功"],"Invitation agent failure":[null,"邀请客服失败"],"Assignment agent successful":[null,"分配角色成功"],"Assignment agent failure":[null,"分配角色失败"],"Update agent successful":[null,"修改客服成功"],"Update agent failure":[null,"修改客服失败"],"Confirm Restore Agent Title":[null,"确定恢复选中的客服？"],"Confirm Restore Agent Content":[null,"恢复客服后该客服可以正常登录云客服系统，并且可以对工单进行操作。"],"Confirm Delete Agent Title":[null,"确定删除当前客服？"],"Confirm Delete Agent Content":[null,"被删除的客服无法登录云客服系统进行工单操作，您可以在“已删除客服”中查看到该客服，并且可以进行恢复操作。"],"Delete agent successful":[null,"删除客服成功"],"Delete Agent Forbidden Title":[null,"无法完成删除客服动作"],"Delete Agent Forbidden Content":[null,"该客服下有未关闭的工单，请先将工单关闭或者指派给其他客服后再将其删除。"],"Delete agent failure":[null,"删除客服失败"],"Update general successful":[null,"修改基础配置成功"],"Update general failure":[null,"修改基础配置失败"],"Add group successful":[null,"创建组成功"],"Add group failure":[null,"创建组失败"],"Update group successful":[null,"修改组成功"],"Update group failure":[null,"修改组失败"],"Delete group successful":[null,"删除组成功"],"Delete group failure":[null,"删除组失败"],"Ticket types error, please flush page":[null,"工单类型错误，请刷新页面"],"ticket types should not be null":[null,"请输入正确的类型名称"],"ticket types duplicate":[null,"类型名称重复"],"Success to add ticket types":[null,"工单类型配置成功"],"Fail to add ticket types":[null,"工单类型配置失败"],"update ticket successful":[null,"更新工单成功"],"update ticket failure":[null,"更新工单失败"],"Select a Contact":[null,"搜索联系人"],"add ticket successful":[null,"新建工单成功"],"add ticket failure":[null,"新建工单失败"],"Need Options And Data When Init Select":[null,"获取数据失败"],"restore ticket successful":[null,"恢复工单成功"],"restore ticket failure":[null,"恢复工单失败"],"update memo successfull":[null,"修改备注成功"],"update memo failure":[null,"修改备注失败"],"Confirm Delete Selected Tickets":[null,"确定删除选中的工单？"],"The Deleted Tieckets will not edit,please look up in deleted list":[null,"被删除的工单无法进行编辑，您可以在“已删除工单”中查看到该工单，并且可以进行恢复操作。"],"update tickets successful":[null,"更新工单成功"],"update tickets failure":[null,"更新工单失败"],"Assign to me":[null,"指派给我"],"Over due":[null,"逾期"],"Due Today":[null,"今日到期"],"delete successful":[null,"删除工单成功"],"delete failure":[null,"删除工单失败"],"Select a Contact or Add new Contact":[null,"搜索联系人 或 新建联系人"],"Recovery":[null,"恢复"],"Delete":[null,"删除"],"Opened":[null,"处理中"],"Resolved":[null,"已解决"],"Pending":[null,"等待回复"],"Confirm Delete Tickets Memo":[null,"确定删除工单备注？"],"Confirm Delete Tickets Memo Content":[null,"被删除的联络历史内容将无法恢复。"],"Fail To Show More Tickets":[null,"展开更多操作失败"],"add memo successful":[null,"添加备注成功"],"add memo failure":[null,"添加备注失败"],"delete memo successful":[null,"删除备注成功"],"delete memo failure":[null,"删除备注失败"],"upateExpiredDate successful":[null,"更新到期时间成功"],"upateExpiredDate failure":[null,"更新到期时间失败"],"save successful":[null,"更新工单成功"],"save failure":[null,"更新工单失败"],"Closed":[null,"已关闭"],"delete ticket successful":[null,"删除工单成功"],"delete ticket failure":[null,"删除工单失败"],"Actities":[null,"最近的工单"],"Now Loading The Data":[null,"拼命加载中..."],"No Recent Activity":[null,"当前没有最近的工单"],"At":[null,"于"],"operate ticket timeline":[null,"更新了工单备注"],"ticket expiredDate from":[null,"到期时间由"],"ticket expiredDate to":[null,"更新为"],"ticket requester from":[null,"请求人由"],"ticket requester to":[null,"更新为"],"ticket subject from":[null,"主题由"],"ticket subject to":[null,"更新为"],"ticket description from":[null,"描述由"],"ticket description to":[null,"更新为"],"ticket type from":[null,"类型由"],"ticket type to":[null,"更新为"],"ticket state from":[null,"状态由"],"ticket state to":[null,"更新为"],"ticket priority from":[null,"优先级由"],"ticket priority to":[null,"更新为"],"ticket assignee from":[null,"客服由"],"ticket assignee to":[null,"更新为"],"ticket group from":[null,"组由"],"ticket group to":[null,"更新为"],"Tickets Total":[null,"工单汇总"],"Expried":[null,"逾期"],"Processing":[null,"处理中"],"Paused":[null,"等待回复"],"Overdue":[null,"今日到期"],"Unassigned":[null,"未指派"],"Information":[null,"个人信息"],"User Name":[null,"用户名"],"Name":[null,"姓名"],"WorkNum":[null,"工号"],"Mobile":[null,"手机"],"Post":[null,"职位"],"Remark":[null,"备注"],"Operated Ticket":[null,"对工单进行了操作"],"TicketCreated":[null,"新建工单"],"TicketClosed":[null,"关闭工单"],"TicketDeleted":[null,"删除工单"],"TicketRecovery":[null,"恢复工单"],"TicketEdited":[null,"编辑工单"],"TicketModifiedEexpirationTime":[null,"修改到期时间"],"TicketModifiedAssignee":[null,"修改客服"],"TicketModifiedState":[null,"修改状态"],"TicketModifiedPriority":[null,"修改优先级"],"Agent Information":[null,"客服详情"],"Info agent title":[null,"客服的管理"],"Agent Info":[null,"客服信息"],"Recently assigned jobs":[null,"客服相关的工单"],"Info agent help document":[null,"您可以在这里查看客服的基础信息，对客服的信息进行修改，如果您的客服已经不在服务的部门或者离职，您还可以对这个客服进行删除，被删除的客服将可以通过被删除的客服列表进行查看，但在这个客服被恢复之前，无法再将工单指派给这个客服。"],"Add Contacts":[null,"添加联系人"],"Contacts Name":[null,"姓名"],"Nickname":[null,"昵称"],"Name required":[null,"请输入正确的姓名"],"Gender":[null,"性别"],"Unknown":[null,"--"],"Male":[null,"男"],"Female":[null,"女"],"Birthday":[null,"生日"],"Date pattern, example: %s":[null,""],"Email":[null,"邮箱"],"Invalidation Email":[null,"请输入正确的邮箱地址"],"Email Duplicate":[null,"邮箱已存在"],"Mobile Duplicate":[null,"手机已存在"],"Telephone":[null,"电话"],"Address":[null,"地址1"],"Address 2":[null,"地址2"],"Corporation":[null,"公司"],"Title":[null,"职务"],"Memo":[null,"备注"],"Save":[null,"保存"],"Create Corporation":[null,"添加公司"],"Create Contact":[null,"添加联系人"],"Customers":[null,"客户"],"Contacts":[null,"联系人"],"Corporations":[null,"公司"],"Alphabet":[null,"未知"],"Display":[null,"显示"],"All":[null,"全部联系人"],"Contact Deleted":[null,"已删除联系人"],"Update":[null,"编辑"],"Restore":[null,"恢复"],"Contacts Informations":[null,"联系人详情"],"Info contacts title":[null,"查看和编辑客户的信息"],"Submit":[null,"保存"],"Info contacts help document":[null,"您可以在这里查看客户的基础信息和这个客户相关的事件，客户作为您企业的珍贵数据，您随时可以补全或者修改和这个客户相关的资料，以便更加了解您的客户，更精准的为客户提供服务。"],"Status":[null,"状态"],"Agent":[null,"客服"],"Contacts Tickets":[null,"联系人相关的工单"],"No Recent Data":[null,"当前联系人没有工单"],"View All Tickets":[null,"查看全部"],"Contact Delete":[null,"删除"],"Contact Restore":[null,"恢复"],"Now Loading...":[null,"拼命加载中..."],"Non Contacts":[null,"当前没有联系人"],"Quickly add current contact to the company":[null,"快速添加公司下联系人"],"Quick Add Contacts":[null,"快速添加联系人"],"Contact Name":[null,"输入联系人姓名"],"Email or Mobile required":[null,"请输入邮箱或手机"],"Add":[null,"添加"],"State Opened":[null,"处理中"],"State Resolved":[null,"已解决"],"State Pending":[null,"等待回复"],"State Closed":[null,"已关闭"],"Update Contacts":[null,"编辑联系人"],"Reset":[null,"重置"],"Create corporation title":[null,"公司的添加和编辑"],"Corporation Name":[null,"公司名称"],"Corporation Name Placeholder":[null,"输入公司名称"],"Invalid Corporation Name":[null,"请输入正确的公司名称"],"Corporation Already Exists":[null,"该公司已存在"],"Corporation Memo Placeholader":[null,"公司备注"],"Description":[null,"描述"],"Corporation Description Placeholder":[null,"公司描述"],"Domain":[null,"公司域名"],"Corporation Domain Placeholder":[null,"公司域名"],"Corporation Domain Help text":[null,"示例: yourdomain.yunkefu.com"],"Create corporation help document":[null,"<p>云客服提供以公司的形式将部分有公司属性的客户进行分类，您可以根据您的业务情况，随时管理公司。</p><p>删除公司的时候有公司属性的客户不会被删除，仍然可以通过点击客户-联系人找到相应的联系人并查看详细信息。</p>"],"Create":[null,"添加"],"Corporation Infomations":[null,"公司详情"],"<a href=\"/corporations/%s/contacts\">%d Corporation Contacts</a>":[null,"<a href=\"/corporations/%s/contacts\">%d</a> 个联系人"],"Non Corporations":[null,"当前没有公司"],"Qucik Add":[null,"快速添加公司"],"Update Corporation":[null,"编辑公司"],"Update corporation title":[null,"公司的添加和编辑"],"Corporation Description":[null,"描述"],"Update corporation help document":[null,"<p>云客服提供以公司的形式将部分有公司属性的客户进行分类，您可以根据您的业务情况，随时管理公司。</p><p>删除公司的时候有公司属性的客户不会被删除，仍然可以通过点击客户-联系人找到相应的联系人并查看详细信息。</p>"],"Confirm Title":[null,"提示"],"Submit Button":[null,"确定"],"Cancel Button":[null,"取消"],"Confirm Message":[null,"确定"],"Dialog Title":[null,"标题"],"Dialog Message":[null,"消息对话框"],"The personal data provided":[null,"个人信息"],"Logout":[null,"退出登录"],"Home":[null,"首页"],"Tickets":[null,"工单"],"Statistics":[null,"统计"],"Settings":[null,"配置"],"Create Ticket":[null,"新建工单"],"Remove Uploaded File":[null,"删除"],"<i class=\"fa fa-link\"></i> Choose files":[null,"上传文件"],"<i class=\"fa fa-link\"></i> Choose a picture":[null,"上传图片"],"Update Personal":[null,"编辑个人信息"],"Agent WorkNum Placeholder":[null,"工号"],"workNum has been exists":[null,"工号已存在"],"Agent Post Placeholder":[null,"职位"],"Agent Remark Placeholder":[null,"备注"],"Rest Password":[null,"重置密码"],"Password":[null,"密码"],"Passowrd required":[null,"请输入正确的密码"],"password min error required":[null,"密码由6-32位大小写字母、数字和符号组成"],"password max error required":[null,"密码由6-32位大小写字母、数字和符号组成"],"Confirm PD":[null,"确认密码"],"confirmPassword required":[null,"请输入正确的密码"],"confirmPasswordError required":[null,"密码与确认密码不一致"],"Update password":[null,"重置密码"],"Password required":[null,"请输入正确的密码"],"password error required":[null,"密码由6-32位大小写字母、数字和符号组成"],"Password min error required":[null,"密码由6-32位大小写字母、数字和符号组成"],"Password max error required":[null,"密码由6-32位大小写字母、数字和符号组成"],"New password":[null,"新密码"],"New passowrd required":[null,"请输入正确的密码"],"new password min error required":[null,"密码由6-32位大小写字母、数字和符号组成"],"new password max error required":[null,"密码由6-32位大小写字母、数字和符号组成"],"Confirm password":[null,"确认新密码"],"Confirm Password required":[null,"请输入正确的密码"],"Confirm password Error required":[null,"新密码与确认新密码不一致"],"Confirm password min error required":[null,"密码由6-32位大小写字母、数字和符号组成"],"Confirm password max error required":[null,"密码由6-32位大小写字母、数字和符号组成"],"From":[null,"联系人"],"Create At":[null,"创建于"],"nowSearch":[null,"拼命搜索中..."],"noSearchResult":[null,"当前没有搜索结果"],"all":[null,"全部"],"contacts":[null,"联系人"],"corporations":[null,"公司"],"tickets":[null,"工单"],"Priroity 20":[null,"低"],"Priroity 40":[null,"中"],"Priroity 60":[null,"高"],"Priroity 80":[null,"紧急"],"Create Agent":[null,"创建客服"],"Add agent title":[null,"客服的创建和编辑"],"Agent User Name Placeholder":[null,"请输入邮箱地址"],"UserName required":[null,"请输入正确的邮箱地址"],"Invalidation UserName":[null,"请输入正确的邮箱地址"],"Mail has been registered":[null,"邮箱已被注册"],"Name error required":[null,"请输入正确的姓名"],"password required":[null,"请输入正确的密码"],"password length min":[null,"密码由6-32位大小写字母、数字和符号组成"],"password length max error":[null,"密码由6-32位大小写字母、数字和符号组成"],"Roles information":[null,"角色信息"],"Agent Roles":[null,"当前角色"],"Add agent help document":[null,"<p>创建或者编辑客服都需要填写客服的基础信息，并且选择当前客服的角色，角色支持多选，例如，一个客服可以同时拥有管理员和质量检查两个角色。</p><p>目前无法修改客服的邮箱，我们将在之后添加客服邮箱的修改功能。</p>"],"Update Agent":[null,"编辑客服"],"Reset password":[null,"重置密码"],"Invitation Agents":[null,"邀请客服"],"Tickets type configuration":[null,"邀请客服"],"Invitation agents title":[null,"添加团队成员的邮箱，邀请他们进入云客服系统。邮箱地址之间用逗号、分号、空格隔开。"],"Mail required":[null,"请输入正确的邮箱地址"],"Mail":[null,"邮箱"],"Mail error required":[null,"格式错误"],"Mail repeat required":[null,"重复"],"Mail max required":[null,"每次最多可邀请10个客服"],"Send invitation email":[null,"发送邀请邮件"],"Tickets type configuration help document":[null,"<p>您可以在这里同时邀请一个或者多个客服，输入客服的邮箱地址（邀请多个时通过“，”“；”“空格”区分），点击发送邀请，被邀请的客服即会收到您的邀请邮件，通过邮件链接激活自己的登录权限。</p><p>被邀请的客服默认角色为“客服”角色，如果需要修改权限，请管理员通过“配置->客服”修改客服的角色。</p>"],"Reset Password":[null,"重置密码"],"Resetpassword agent title":[null,"客服的重置密码"],"Resetpassword agent help document":[null,"当您的客服忘记自己的密码时，作为管理员，您可以重置客服的密码，当重置成功后，我们将通过邮件的形式，提醒客服新的密码已经重置成功并且生效。同时客服也可以通过登录页面进行忘记密码的操作，来进行密码的找回。"],"Agent roles configure":[null,"配置客服角色"],"Agent roles configure title":[null,"配置客服角色"],"Configure Roles":[null,"配置角色"],"Leader":[null,"班长"],"Administrator":[null,"管理员"],"roles title":[null,"勾选所需要的角色，支持多选"],"Agent roles configure document":[null,"云客服提供方便的客服角色配置功能，您可以对客服进行角色的变更，一个客服可以同时具备多个角色，例如您可以让客服同时具备管理员和普通客服两个角色，这样这个客服既可以进行工单的处理，又可以查看报表或操作云客服的高级配置。"],"Non Items Tickets":[null,"当前客服没有工单"],"Come From":[null,"联系人"],"Update agent title":[null,"客服的创建和编辑"],"Update agent help document":[null,"<p>创建或者编辑客服都需要填写客服的基础信息，并且选择当前客服的角色，角色支持多选，例如，一个客服可以同时拥有管理员和质量检查两个角色。</p><p>目前无法修改客服的邮箱，我们将在之后添加客服邮箱的修改功能。</p>"],"Confirm":[null,"提示"],"Delete Agents?":[null,"确定删除当前客服？"],"Roles":[null,"角色"],"Non Items Agents":[null,"当前没有客服"],"Trash Agents":[null,"已删除客服"],"Trash agents title":[null,"客服的管理"],"Deleted Agents":[null,"已删除客服"],"All Agents":[null,"全部客服"],"Trash agents help document":[null,"您可以在这里查看客服的基础信息，对客服的信息进行修改，如果您的客服已经不在服务的部门或者离职，您还可以对这个客服进行删除，被删除的客服将可以通过被删除的客服列表进行查看，但在这个客服被恢复之前，无法再将工单指派给这个客服。"],"Invitation Agent":[null,"邀请客服"],"Agents":[null,"客服"],"Agent title":[null,"客服的管理"],"Create Time":[null,"创建时间"],"Asc":[null,"升序"],"Desc":[null,"降序"],"Agent help document":[null,"您可以在这里查看客服的基础信息，对客服的信息进行修改，如果您的客服已经不在服务的部门或者离职，您还可以对这个客服进行删除，被删除的客服将可以通过被删除的客服列表进行查看，但在这个客服被恢复之前，无法再将工单指派给这个客服。"],"General":[null,"基础配置"],"General title":[null,"定制您的云客服"],"Global Title":[null,"公司名称"],"General Settings Title Required":[null,"请输入正确的公司名称"],"Logo":[null,"公司logo"],"Upload image title":[null,"仅支持512k以内的jpg、gif、png格式图片"],"Logo Anchor":[null,"logo链接地址"],"home anchor error, example: http://yourcompany.com":[null,"请输入正确的Logo链接地址，示例: http://yourdomain.yunkefu.com"],"General help document":[null,"<p>在这里，您可以自由的定制您的云客服系统，为客户和客服人员提供个性化的登录界面。您可以使用公司的logo、名称，让您的云客服与众不同。</p><p>我们将会陆续开放更多的基础配置功能，例如个性化的云客服系统颜色搭配、时区、语言等。</p>"],"Create Group":[null,"创建组"],"Add group title":[null,"组的管理"],"Group Name":[null,"组名称"],"Invalid Group Name":[null,"请输入正确的组名称"],"Group Already Exists":[null,"该组已存在"],"Add group help document":[null,"<p>您可以把客服分为不同的组，如“销售”和“产品管理”组。分组有助于指派工单、创建自动回复模板、管理工作流并生成组相关的报表。一个客服可以是多个组的成员。</p><p>按照您的业务模式建立相应的组，有助于客服处理工单时更方便、准确的将工单转派给相应的处理人员或部门。</p>"],"Tips":[null,"确定删除选中的组？"],"Confirm Delete Group":[null,"被删除的组所对应的工单将继续保留，并且可以手动指派到其他组下。"],"Ok":[null,"确定"],"Non Groups Items":[null,"当前没有组"],"Update Group":[null,"编辑组"],"Update group title":[null,"组的管理"],"Update group help document":[null,"<p>您可以把客服分为不同的组，如“销售”和“产品管理”组。分组有助于指派工单、创建自动回复模板、管理工作流并生成组相关的报表。一个客服可以是多个组的成员。</p><p>按照您的业务模式建立相应的组，有助于客服处理工单时更方便、准确的将工单转派给相应的处理人员或部门。</p>"],"Group":[null,"组"],"Group title":[null,"组的管理"],"Group help document":[null,"<p>您可以把客服分为不同的组，如“销售”和“产品管理”组。分组有助于指派工单、创建自动回复模板、管理工作流并生成组相关的报表。一个客服可以是多个组的成员。</p><p>按照您的业务模式建立相应的组，有助于客服处理工单时更方便、准确的将工单转派给相应的处理人员或部门。</p>"],"Setting title":[null,"配置"],"Settings HelpDesk Configuration":[null,"公司信息"],"SLA Policy":[null,"SLA 策略"],"Business Times":[null,"工作时间"],"Settings Connect Configuration":[null,"接入"],"Settings Connect Title":[null,"微信客服"],"Settings connect mail":[null,"邮件"],"Settings Ticket Types Configuration":[null,"业务参数"],"Settings Ticket Types Title":[null,"工单类型配置"],"Settings sla rule":[null,"SLA设置"],"Setting help docunment":[null,"<p>配置功能是您企业的高级功能，您可以在这里个性化的设置自己的云客服基础信息、管理您的客服和组、自定义角色、定制符合自身公司流程的工单内容等。</p><p>配置功能属于高级功能，不建议过多的角色具备配置权限，以免造成流程的混乱，请管理员妥善分配公司具备配置功能的角色。</p>"],"Default mail":[null,"默认邮箱"],"Default email":[null,""],"Forward to":[null,"转发至"],"Setting mail":[null,"邮箱设置"],"Mail title":[null,""],"Mail help document":[null,""],"Role alert":[null,"这是一个默认的系统角色，无法编辑或删除，您可以查看其具备的权限。"],"Definition":[null,"名称"],"Super admin":[null,"超级管理员"],"Describe":[null,"描述"],"Role description":[null,"最高权限，可以对客户和工单执行操作，也可以执行高级配置、管理客服、查看报表等操作。"],"Authority":[null,"权限"],"Scroll to":[null,"移动到"],"Customer":[null,"客户"],"Report form":[null,"统计"],"Configure":[null,"配置"],"Check tickets":[null,"查看工单"],"Add tickets":[null,"新建工单"],"Update tickets":[null,"编辑工单"],"Delete tickets":[null,"删除工单"],"Add remark":[null,"添加备注"],"Update remark":[null,"编辑备注"],"Delete remark":[null,"删除备注"],"Check contacts":[null,"查看联系人"],"Check company":[null,"查看公司"],"Add customers":[null,"添加联系人"],"Add company":[null,"添加公司"],"Update customers":[null,"编辑联系人"],"Update company":[null,"编辑公司"],"Delete customers":[null,"删除联系人"],"Delete company":[null,"删除公司"],"Check report from":[null,"查看报表"],"Basic configuration":[null,"基础配置"],"Configure company name":[null,"配置公司名称"],"Configure company logo and link address":[null,"配置公司logo及链接地址"],"Add agent":[null,"创建客服"],"Update agent":[null,"编辑客服"],"Delete agent":[null,"删除客服"],"Add group":[null,"创建组"],"Update group":[null,"编辑组"],"Delete group":[null,"删除组"],"Role":[null,"角色"],"Check roles info":[null,"查看角色详情"],"ticket types":[null,"工单类型"],"configure ticket types":[null,"配置工单类型"],"Agent name":[null,"客服"],"Agent description":[null,"受理客户诉求的权限，可以对客户和工单等执行操作。"],"Roles detail":[null,"角色详情"],"Info role title":[null,"默认的角色"],"Info role help document":[null,"<p>云客服提供的默认角色，您可以在这里查看默认的角色具备的功能和权限，但不能修改默认角色的权限，如果您需要自定义您的角色，可以点击管理-角色，进行角色的添加和编辑非默认的角色。</p><p>您可以设定一个客服同时拥有多个角色。</p>"],"Leader Description":[null,"受理客户诉求及查看统计报表的权限，可以对客户和工单等执行操作，同时可以查看客服人员的工作情况。"],"Administrators":[null,"超级管理员"],"Administrators Description":[null,"最高权限，可以对客户和工单执行操作，也可以执行高级配置、管理客服、查看报表等操作。"],"Agents Description":[null,"受理客户诉求的权限，可以对客户和工单等执行操作。"],"Role title":[null,"角色的管理"],"Role help document":[null,"<p>角色帮助您创建和编辑客服访问云客服的权限。您可以创建新的角色，定义具有相应角色的客服能够在云客服中执行的动作，并在创建或者编辑客服的时候确定客服的角色。</p><p>例如，您可以创建一个名为“统计分析”的角色，允许其查看报表，但不允许他管理云客服的高级配置。</p><p>创建角色后，即可点击管理-客服，把角色指派给相应的客服。</p>"],"Priority":[null,"优先级"],"To solve in a given period of time":[null,"在以下规定时间内解决"],"Service time":[null,"服务时间"],"Emergency":[null,"紧急"],"Day(s)":[null,"天"],"Calendar Time":[null,"自然日"],"High":[null,"高"],"Middle":[null,"中"],"Low":[null,"低"],"Sla service level strategy":[null,"SLA服务水平策略"],"Setting tickets types":[null,"服务级别协议"],"Setting tickets types document":[null,"<p>服务级别协议(SLA)是指服务支持团队与客户就服务的品质、水准、及时性等方面所达成的双方共同认可的协议。<p><p>云客服使用SLA确定每个工单的“到期”时间，您需要在到期时间之前“关闭”工单，以避免逾期工单出现。<p><p>在您设定工单优先级的时候，系统自动根据优先级设定工单的到期时间，具体规则：  •优先级低：5天  •优先级中：3天  •优先级高：2天  •优先级紧急：1天<p><p>如果以上规则不能达到您的要求，还可以在工单详情页面上修改工单的具体到期时间。<p>"],"Ticket types":[null,"工单类型配置"],"Ticket types Title":[null,"工单类型配置"],"Ticket types options":[null,"类型选项"],"down":[null,"向下移动"],"Up":[null,"向上移动"],"Add one Ticket types":[null,"添加新的选项"],"Back":[null,"返回"],"Ticket types help document":[null,"<p>云客服默认的工单类型，可以在这里进行调整，您可以按照业务需要，配置符合自己实际业务的工单类型，在这里您可以任意修改，删除多余的类型，或者添加新的类型。</p><p>需要注意的是，工单类型至少需要保留一个，以便客服在实际创建工单时可选择，类型配置成功后，已经保存的工单，之前的类型仍然可以查看到，但修改类型时只能选择新的类型。</p>"],"Create tickets num":[null,"创建"],"Processing tickets num":[null,"处理中"],"Wait for reply tickets num":[null,"等待回复"]," Resolved tickets num":[null,"已解决"],"Closed tickets num":[null,"已关闭"],"total":[null,"合计"],"Non Items Statistics Data":[null,"当前日期内无数据，请重新选择日期"],"Agent tickets summary":[null,"客服工单汇总表"],"Select the time zone":[null,"选择工单创建时间"],"Yesterday":[null,"昨天"],"The last three days":[null,"最近3天"],"The last five days":[null,"最近5天"],"The last seven days":[null,"最近7天"],"The last fifteen days":[null,"最近15天"],"The last thirty days":[null,"最近30天"],"selectedMethod required":[null,"选择统计方式"],"Display Report":[null,"开始统计"],"Reports summary":[null,"统计"],"Reports summary title":[null,"统计报表"],"Reports summary help document":[null,"<p>报表可以最真实的反应出当前您的云客服平台经营情况，云客服提供整体平台的工单情况汇总表、客服工单的汇总表、组工单的汇总表等，帮助您分析您的服务水平现状。</p><p>例如，如果处理中的工单数量过多，可能反映出您的服务效率需要适当提升。是否可以通过优化服务流程、系统的培训服务人员，从而提高服务效率，提升客户的满意度。</p>"],"Ticket Attachment:":[null,"工单附件"],"Click Download Attachment":[null,"点击下载附件"],"Remove Attachment":[null,"删除附件"],"Commit Ticket":[null,"新建工单"],"Add ticket title":[null,"工单的提交"],"Search Requester":[null,"搜索联系人"],"or":[null,"或"],"add new requester":[null,"新建联系人"],"Requester Request":[null,"请输入正确的联系人"],"Subject":[null,"主题"],"Subject Can Not Be Null":[null,"请输入正确的主题"],"Too Many Words":[null,"输入内容过长"],"Type":[null,"类型"],"Ticket State":[null,"状态"],"Priority 20":[null,"低"],"Priority 40":[null,"中"],"Priority 60":[null,"高"],"Priority 80":[null,"紧急"],"Assignee Agent":[null,"客服"],"Description length exceeds the allowable limit":[null,"输入内容过长"],"Upload file title":[null,"仅支持2M以内的文本、音频、图片、压缩等格式的文件，上传文件数量不能超过5个"],"Save And Close":[null,"保存并关闭"],"Save And Continue":[null,"保存并继续"],"Add ticket help document":[null,"<p>客户的诉求，可以通过工单的方式进行记录，并且诉求的变化和处理的过程，都可以通过工单的联络历史展现，以便后续的跟踪和处理。</p><p>新的问题可以通过记录一张新工单的形式处理，如果记录信息有误，还可以通过编辑功能调整记录的内容。</p>"],"Restore Ticket":[null,"恢复"],"Deleted Tickets List":[null,"已删除工单"],"Deleted Tickets":[null,"已删除工单"],"My Opened Tickets":[null,"我的处理中工单"],"All Tickets":[null,"全部工单"],"Non Items Deleted Tickets":[null,"当前没有工单"],"Craete At":[null,"创建时间"],"Expired Date":[null,"到期时间"],"Update ticket expires":[null,"修改"],"Set ticket expired date":[null,"修改到期时间"],"ExpireCancel":[null,"取消"],"ExpiredSave":[null,"保存"],"Requester Info":[null,"联系人信息"],"Tickets Attributes":[null,"工单属性"],"Source":[null,"来源"],"Phone":[null,"手机"],"Wei Xin":[null,"微信"],"Web":[null,"网页"],"Seat":[null,"客服"],"To ticket add memo":[null,"对工单添加备注"],"Description not allow empty":[null,"请输入工单备注内容"],"Update Memo":[null,"更新备注"],"Requeste At":[null,"报告于"],"from":[null,"联系人"],"accessory":[null,"附件"],"Show":[null,"展开更多"],"Add Memo":[null,"添加备注"],"Save Remark":[null,"保存备注"],"My Open And Pending Tickets":[null,"我的处理中和等待回复的工单"],"Edit":[null,"编辑"],"Save As":[null,"另存为"],"Me":[null,"我待办的"],"Create By Me":[null,"我创建的"],"Not Assign":[null,"未指派"],"Created":[null,"创建时间"],"All Times":[null,"所有"],"4 Hours ago":[null,"4小时内"],"Today":[null,"今天"],"3 days ago":[null,"3天内"],"7 days ago":[null,"7天内"],"ExpiredDate":[null,"到期时间"],"8 Hours":[null,"8小时内"],"24 Hours":[null,"24小时内"],"48 Hours":[null,"48小时内"],"State":[null,"状态"],"Requester":[null,"联系人"],"Ticket Source WEB":[null,"门户"],"Ticket Source Weixin":[null,"微信"],"by web":[null,"通过门户报告"],"by weixin":[null,"通过微信报告"],"Assign":[null,"指派给客服"],"Close":[null,"关闭工单"],"Non Tickets Items":[null,"当前没有工单"],"Assign Tickets to Agent":[null,"指派给客服"],"No Agent":[null,"当前没有客服"],"Agent is not allowed to be empty":[null,"请选择客服"],"Tickets Filter":[null,"工单"],"Get It":[null,"指派给自己"],"Batch":[null,"批量"],"Merge":[null,"合并"],"Mark As Trash":[null,"标记为垃圾"],"Export":[null,"导出"],"Non Items":[null,"当前没有工单"],"Update Ticket":[null,"编辑工单"],"Update ticket title":[null,"工单的提交"],"File name":[null,"文件名"],"Size":[null,"文件大小"],"Update ticket help document":[null,"<p>客户的诉求，可以通过工单的方式进行记录，并且诉求的变化和处理的过程，都可以通过工单的联络历史展现，以便后续的跟踪和处理。</p><p>新的问题可以通过记录一张新工单的形式处理，如果记录信息有误，还可以通过编辑功能调整记录的内容。</p>"],"Show Activity":[null,"显示活动"],"Commit":[null,"添加备注"],"Ticket":[null,"工单详情"],"Consulting service":[null,"咨询"],"Proposals":[null,"建议"],"Requests":[null,"请求"],"Complaints":[null,"投诉"],"Other":[null,"其他"]}}};

    var jed = window.jed = new Jed(data);
    window.gettext = function() {
        var context = arguments[0];
        return jed.ngettext(context, context, 1);
    };
    window.ngettext = function(context, contexts, n) {
        return jed.ngettext(context, contexts, n ? 1 : n);
    };
    return jed;
});