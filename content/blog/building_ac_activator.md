# AC Activator 开发记录（一）

## 前言。

想必各位自己装机来使用 Windows 的朋友应该都或多或少听说过 KMS 激活这种玩意儿。KMS 激活的出现使得为大型组织提供批量的 Windows 激活变得更加便捷。然而，对于各位一开始了解 KMS 激活的朋友们，KMS 的使用流程貌似是略有点儿复杂。举个例子，如果你想要用 KMS 方式激活一台电脑，你要依次输入如下命令：

```bat
slmgr /ipk <product key>
slmgr /skms <kms server>
slmgr /ato
```

这三个步骤，缺一不可。对于一些『专业人士』来讲，这是十分简单的。但是，对于大多数第一次接触 Windows 操作系统安装的小白来说，这些在命令提示符上执行的命令貌似有点 **过于复杂** 了。

为了进一步地简化流程，我开发了一个现代化的、简易的 GUI 工具，能够便捷地帮助小白完成 Windows 系统的 KMS 激活。同其他的 KMS 激活工具不同的是，本工具貌似是第一次使用 WinUI 3 作为 UI 平台组件的 KMS GUI 工具。使用 WinUI 3 的一条重要理由是为了摆脱目前已有的激活工具的简陋界面。同其他 KMS 激活工具相比，它的界面要更加简便，易于操作——更关键的是赏心悦目。

## 构建一个『美观的界面』：草图。

在构建这个应用之前，我设想的应用工作流程是这样的：

打开 App -> 用户点击激活按钮 -> App 执行激活 -> 提示用户激活完成。

在构建激活的业务流程之前，我们先来构建一个美观的界面。

![UI 草图](/blog/included_image/building_ac_activator/skeleton.png)

我用一点时间自绘了一个软件界面的草图。通过草图，我们可以看到：应用的主窗口是一个 `NavigationView`，在 `NavigationView` 中是一个 `Frame`，内含着各个可供操作的页面（`Page`）。主页面的构造是左上角显示标题，中间放有给用户的提示，右下角留有『开始激活』的操作按钮。

## MainWindow 的实现。

以下是  `MainWindow.xaml` 以及 `MainWindow.xaml.cs` 的内容：

```xaml
<Window
    x:Class="ACActivator.MainWindow"
    xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
    xmlns:local="using:ACActivator"
    xmlns:d="http://schemas.microsoft.com/expression/blend/2008"
    xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" 
    xmlns:animatedvisuals="using:ABI.Microsoft.UI.Xaml.Controls.AnimatedVisuals"
    mc:Ignorable="d"
    >

    <NavigationView x:Name="NavView"         
                    PaneDisplayMode="Left"
                    IsBackButtonVisible="Collapsed"
                    ItemInvoked="NavView_ItemInvoked"
                    Loaded="NavView_Loaded"
                    PaneTitle="AC Activator"       
                    >
        <NavigationView.MenuItems>
            <NavigationViewItem Content="开始操作" Tag="ActionPage" Icon="Play"/>
        </NavigationView.MenuItems>
        <Frame x:Name="ContentFrame" />
    </NavigationView>

</Window>
```

```c#
namespace ACActivator
{
    /// <summary>
    /// An empty window that can be used on its own or navigated to within a Frame.
    /// </summary>
    public sealed partial class MainWindow : Window
    {

        private string tagNow = "ActionPage";
        public MainWindow()
        {
            this.InitializeComponent();
            Title = "AC Activator";

        }

        private void NavView_ItemInvoked(NavigationView sender, NavigationViewItemInvokedEventArgs args)
        {
            Type _page = typeof(ActionPage);
            if (args.IsSettingsInvoked == true)
            {
                _page = typeof(SettingsPage);
                NavView.Header = "设置";
            } 
            else if (args.InvokedItemContainer.Tag.ToString() == "ActionPage")
            {
                _page = typeof(ActionPage);
                NavView.Header = "开始操作";                              
            }

            if (args.InvokedItemContainer.Tag.ToString() != tagNow)  ContentFrame.Navigate(_page, null, args.RecommendedNavigationTransitionInfo);
            tagNow = args.InvokedItemContainer.Tag.ToString();
        }

        private void NavView_Loaded(object sender, RoutedEventArgs e)
        {
            Type _page;
            NavView.Header = "开始操作";
            
            _page = typeof(ActionPage);
            ContentFrame.Navigate(_page, null);
            NavView.SelectedItem = NavView.MenuItems.OfType<NavigationViewItem>().First();
        }

    }
}
```

## ActionPage 的实现。

接下来我们来设计操作页 `ActionPage` 。`ActionPage` 是用户进行主要的激活操作的页面。我想要通过这个页面达到的目标是：在页面中有几个提示，可以提醒用户注意更改 KMS 设置的危险性、劝导用户使用正版而非盗版、并且推广 GitHub 仓库。页面的右下角有一个按钮，点击按钮之后会在按钮上方弹出一个提示框，提醒用户正在使用的 KMS 服务器的地址并且再次同用户确认是否要继续操作。

```xaml
<Page
    x:Class="ACActivator.ActionPage"
    xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
    xmlns:local="using:ACActivator"
    xmlns:d="http://schemas.microsoft.com/expression/blend/2008"
    xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
    mc:Ignorable="d"
    Background="{ThemeResource ApplicationPageBackgroundThemeBrush}">
    <Grid Background="{StaticResource acBackgroundBrush}">
        <StackPanel Margin="55,20,20,0" Background="{StaticResource acBackgroundBrush}">
            <!--这里包含着页面的内容。-->   
        </StackPanel>
    </Grid>    
</Page>
```

> 在这里面，你可能会很好奇 `{StaticResource acBackgroundBrush}` 是在哪里定义的。这一点会在接下来的『适配深色模式』中讲到。

我准备用 `InfoBar` 来实现页面中对用户的提示。这样的提示比起直接将提示性的文字放在窗口中要更加的鲜明、美观、整洁。良好的，分成多段的且有着各自的『提升』的『模块』可以使得页面的分布更加有章法、有『节奏感』。你懂得，这是十分遵循『Fluent Design』的设计风格。

![提示](/blog/included_image/building_ac_activator/infobars.png)

这样的提示就是我的最终实现目标。可以看到，每一个提示都被分在了一个个小 `InfoBar` 里，整齐且各自有各自的色彩地排列在一起。

以最下面的『支持我们』提示框为例。这个提示框左侧有一个 ❤ 的 Icon，右侧分别有着小标题『支持我们！』，正文和一个可供跳转至 GitHub 仓库上的链接按钮『看一眼我们的仓库』。

```xaml
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

其中，小标题『支持我们』被赋值给 `InfoBar` 的属性 `Title`，其余的 `Message`、 `IconSource`、`ActionButton` 分别为提示消息的正文、图标和操作按钮。需要说明一下的是，`Serverity="Error"` 只是为了给这个提示框一个粉红色的背景色，而并非真的同程序所产生的错误有什么联系。

然后，我们要实现点击按钮后弹出的提示框。这个提示框中会弹出一条提醒你所使用的 KMS 服务器的提示，告诉你要核对下服务器，别再填错了地址。

![喂！兄弟，不核验一下吗？](/blog/included_image/building_ac_activator/flyout.png)

这个功能，就要借助于 `Flyout` 来实现。以下是这个按钮的实现代码：

```xaml
<Button 
    Margin="0, 0, 20, 20" 
    Style="{StaticResource AccentButtonStyle}" 
    HorizontalAlignment="Right" 
    VerticalAlignment="Bottom" 
    Width="50" 
    Height="50" 
    x:Name="ActionButton">
    <!--激活按钮-->
    <FontIcon FontFamily="{StaticResource SymbolThemeFontFamily}" Glyph="&#xe945;"/>
    <Button.Flyout>
        <!--提醒用户：注意KMS地址-->
        <Flyout>
            <StackPanel>
                <TextBlock Style="{ThemeResource BaseTextBlockStyle}" Text="{x:Bind noticeText}" Margin="0,0,0,12" x:Name="ButtonFlyoutText"/>
                <Button Content="明白，继续" Click="Button_Click"/>
            </StackPanel>
        </Flyout>
    </Button.Flyout>
</Button>
```

到现在为止，成功实现了一个美观的主界面，它具有完全符合 Fluent Design 设计语言的 UI，同时基于用户以人性化的、简洁的体验。在之后的文章中，会提到如何实现设置界面，以及最重要的——如何实现调用 KMS 执行实行激活。
