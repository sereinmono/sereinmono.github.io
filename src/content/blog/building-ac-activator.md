---
title: 'AC Activator 开发记录：使用 WinUI 3 构建现代 KMS 激活工具'
description: '记录了使用 WinUI 3 开发 Windows KMS 激活工具的完整过程，包括界面设计、设置存储、权限提升等技术细节。'
date: '2022-05-10'
tags: ['WinUI 3', 'Windows 开发', 'C#', '项目记录']
image: '/images/ac-activator.png'
---

> 重要须知：作者不支持不赞成任何形式、任何目的的 Windows 盗版行为。文章中的 Github 仓库已经设置为私有。

## 缘起

想必各位自己装机来使用 Windows 的朋友应该都或多或少听说过 KMS 激活。KMS（Key Management Service）激活的出现使得为大型组织提供批量的 Windows 激活变得更加便捷。然而，对于初次了解 KMS 激活的朋友们，KMS 的使用流程貌似是略有点儿复杂。

举个例子，如果你想要用 KMS 方式激活一台电脑，你要依次输入如下命令：

```batch
slmgr /skms <KMS服务器地址>
slmgr /ato
slmgr /xpr
```

这三个步骤，缺一不可。对于一些「专业人士」来讲，这是十分简单的。但是，对于大多数第一次接触 Windows 操作系统安装的小白来说，这些在命令提示符上执行的命令貌似有点过于硬核了。

为了进一步简化流程，我开发了一个现代化的、简易的 GUI 工具，能够便捷地帮助小白完成 Windows 系统的 KMS 激活。同其他的 KMS 激活工具不同的是，本工具应该是第一次使用 WinUI 3 作为 UI 平台组件的 KMS GUI 工具。使用 WinUI 3 的一条重要理由是为了摆脱目前已有的激活工具的简陋界面——同其他 KMS 激活工具相比，它的界面要更加简便，易于操作，更关键的是赏心悦目。

## 应用架构设计

在构建这个应用之前，我设想的应用工作流程是这样的：

1. 用户打开应用，进入主页面
2. 主页面显示激活提示和操作按钮
3. 用户可以在设置页面修改 KMS 服务器地址
4. 点击激活按钮后执行激活流程

应用的主窗口是一个 `NavigationView`，内含着各个可供操作的页面。主页面的构造是左上角显示标题，中间放有给用户的提示，右下角留有「开始激活」的操作按钮。

## 构建美观的界面

### 主页面设计

主页面是用户进行主要激活操作的页面。我想要通过这个页面达到的目标是：在页面中有几个提示，可以提醒用户注意更改 KMS 设置的危险性、劝导用户使用正版而非盗版，并且推广 GitHub 仓库。页面的右下角有一个按钮，点击按钮之后会在按钮上方弹出一个提示框，提醒用户正在使用的 KMS 服务器的地址并且再次同用户确认是否要继续操作。

我使用 WinUI 3 的 `InfoBar` 控件来实现页面中对用户的提示。这样的提示比起直接将提示性的文字放在窗口中要更加的鲜明、美观、整洁。良好的，分成多段的且有着各自的「提升」的「模块」可以使得页面的分布更加有章法、有「节奏感」。这是十分遵循 Fluent Design 设计风格的做法。

每一个提示都被分在了一个个小的 `InfoBar` 里，整齐且各自有各自的色彩地排列在一起。以最下面的「支持我们」提示框为例，这个提示框左侧有一个心形 Icon，右侧分别有着小标题「支持我们！」、正文和一个可供跳转至 GitHub 仓库上的链接按钮「看一眼我们的仓库」。

```c#
<InfoBar
     IsOpen="True"
     IsClosable="True"
     Title="支持我们！"
     Margin="0, 1"
     Message="本程序使用热爱作为核心技术。访问托管于Github的项目来给本作品Star。当然，如果发现问题，疑难杂症也可以在这里解决。"
     Severity="Error">
         <InfoBar.IconSource>
             <FontIconSource Glyph="&#xEB52;" Foreground="DarkRed"/>
         </InfoBar.IconSource>
         <InfoBar.ActionButton>
             <HyperlinkButton 
              Content="看一眼我们的仓库"
              NavigateUri="https://github.com/sereinmono/ACActivator"
              Foreground="DarkRed"/>
</InfoBar.ActionButton>
```

### 设置页面设计

在构建激活的业务流程之前，我们需要将设置页面编写出来。这个页面允许用户输入自己希望使用的 KMS 地址，并同时允许用户对其他的偏好设置进行调整。

我选择将 KMS 相关设置分散进「设置」页中而非将其一起放在首页，是为了保持简洁性和可用性。比起认为用户是全知全能的、理智的「操作者」，我更愿意相信 **The User Is Drunk**。

这是一种设计哲学，即采取对用户的理智的零预期，尽一切能力将 App 设计成最为简便易用的样子。作为一个开发者，千万不要过于期望用户使用你应用程序的能力有多高，更何况这就是一个面向于小白的程序——应用的「易于使用」是第一个要考虑的。

## 设置存储的实现

### MSIX 打包的限制

对于一个使用紧凑打包的 Windows 程序来说，MSIX 严格限制了程序对文件的存储。不能把文件直接存在程序所在的文件夹。所以，我们将会把 `settings.json` 存在 AppData 文件夹中。

要注意的是，MSIX 具有灵活的虚拟化，你所存入的 AppData 并不是真正的 AppData 文件夹，仅仅只是一个对特定于该用户和该应用的专门位置的映射，也就是一个「桌面桥」。

之前我尝试过将 `settings.json` 存在应用所工作的文件夹中，结果会出现一个诡异的现象：从编译到运行都十分正常，IDE 无任何提示，生产环境的调试和运行过程中不会出现任何的报错，打包过程一切正常，安装 MSIX 也可以正常进行——**但是在安装后就会闪退**。

### 设置类的架构

为了支持对于设置的读写，我创建了两个类：

```c#
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace ACActivator
{

    internal static class Settings
    {
        readonly static string strFilePath = Path.Combine(Windows.Storage.ApplicationData.Current.LocalFolder.Path, "settings.json");
        public static SettingsInfo ReadSettings()
        {
            if (File.Exists(strFilePath))
            {
                SettingsInfo info = JsonConvert.DeserializeObject<SettingsInfo>(File.ReadAllText(strFilePath));
                return info;
            }
            else
            {
                SettingsInfo info = new SettingsInfo("kms.03k.org", false);
                WriteSettings(info);
                return info;
            }
        }

        public static void WriteSettings(SettingsInfo info)
        {
            File.WriteAllText(strFilePath, JsonConvert.SerializeObject(info));
        }
    }

    internal class SettingsInfo
    { 
        public string KMSUrl;
        public bool haveTaughtHowToStart;
        public SettingsInfo(string KMSUrl, bool haveTaughtHowToStart)
        {
            this.KMSUrl = KMSUrl;
            this.haveTaughtHowToStart = haveTaughtHowToStart;
        }
    }
}
```

- **Settings**：设置「类」。它是一个拥有着静态方法的静态类，无法被实例化，里面实现了读取设置数据和写入设置数据的方法。
- **SettingsInfo**：真正存有设置数据的类，非静态，可以被实例化。它负责读写 `settings.json`。一个序列化的 SettingsInfo 存入其中，需要读取时再反序列化。

将读写设置的业务逻辑独立于 UI 之外，并创立单独的类来办这件事情的一大好处就在于能够实现更高的扩展性和复用性，代码也会变得简明而井井有条。不必将整个对设置的读写的业务逻辑捆绑在 UI 上，实现一个这样的「黑箱」也有助于防止在实现 UI 的过程中将精力过多地放在「如何实现设置的读写」一事上。

序列化与反序列化的操作由 `System.Text.Json` 代劳，不必重复造轮子。

## 核心功能：激活的实现

### 权限问题的困境

在第一篇文章中，我谈到了要激活需要执行三条命令，缺一不可。而我们想要实现的事情也很简单，就是要使用这个 GUI 程序，帮助用户代为执行这三条命令。

然而，我们面临了一个问题：我们固然可以通过创建子进程的方式来实现对于命令的执行，但是「管理员权限」从哪里来？

一开始，我尝试调整 `app.manifest` 文件，将 `requestedExecutionLevel` 设置为 `requireAdministrator`。然后，你就会惊讶地发现，这个应用直接「暴毙」了：无法调试、无法运行。这条路根本走不通。

### PowerShell 与 VBScript 的组合拳

此时我们就需要搬出 PowerShell 了。PowerShell 可以通过 `Start-Process -Verb RunAs` 命令实现通过 UAC 申请提升权限。

然而，这又会涉及到一个问题：我们在执行激活时，会突然蹦出一个黑乎乎的命令提示符糊你脸上——在这种情况下，你到底执行了什么命令，在用户的视角来说全部都一览无余。另外一方面，「弹出另外的窗口」本身就会增加用户不必要的担忧。

在设计应用时，我们追求的是一个「黑箱」：你输入命令并输出结果，并且你不知道黑箱内部发生了什么。表现在开发上来讲，就是不将非必要的信息透露给用户，只提供给用户以结果。

所以，为了隐藏窗口，我们需要依赖于 VBScript：

```vb
Set WshShell = CreateObject("WScript.Shell")
WshShell.Run "cmd /c <activate.bat的绝对路径>", 0, False
```

通过这种方式，我们就可以实现批处理文件在执行时的窗口隐藏。

### 最终的激活流程

我们将这个过程调整为：

1. 由程序创建一个 `activate.bat`
2. 创建一个执行 `activate.bat` 的 `launcher.vbs`
3. 通过 PowerShell 子进程执行 `launcher.vbs`

同样的设计理念，我也将激活的功能单独地分散在一个专门的 `Activator` 类中。这个类是这个应用的「心脏」与「灵魂」：

- 根据应用中提供的 KMS Url 生成 `launcher.vbs` 和 `activate.bat`
- `launcher.vbs` 能够实现在不生成新窗口的情况下运行 `activate.bat`
- `activate.bat` 通过 Windows 提供的 `slmgr.vbs` 完成激活

在实现中，创建 PowerShell 子进程时将 `-NoProfile` 禁用，是因为已经确切了我们要运行什么程序。将 `-WindowStyle Hidden` 设置，是因为我们不想要 PowerShell 创建它的窗口——刚才我们已经提到要对用户塑造一个「黑箱」。

## 总结

通过这个项目，我完整地体验了 WinUI 3 应用开发的全流程，从界面设计到后端逻辑，从设置存储到权限提升。WinUI 3 提供了现代化的 Fluent Design 风格控件，使得即使是工具类应用也能拥有赏心悦目的界面。

如果你对这个项目感兴趣，欢迎在 GitHub 上查看源代码。

---

*本文由 GLM-5 根据作者以往所写的三篇开发记录合并整理而成，记录了 AC Activator 从零到一的完整开发过程。日期 2022-05-10 是原文章最早撰写的时间。*
