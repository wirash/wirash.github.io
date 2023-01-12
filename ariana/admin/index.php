<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<meta http-equiv="X-UA-Compatible" content="IE=edge" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title>Ariana's Muscle 4 Mula - Admin</title>
		<link rel="stylesheet" href="style.css" />
		<script src="assets/script/theme-script.js"></script>
		<script src="assets/script/jquery-3.6.0.min.js"async></script>
		<script src="script.js" defer></script>
	</head>
	<body>
		<svg class="logo">
			<use xlink:href="assets/svg/logo.svg#svg"></use>
		</svg>
		<div class="tab-container">
			<label class="tab btn toggle icon-btn" users-tab>
				<svg>
					<use xlink:href="assets/svg/users.svg#svg"></use>
				</svg>
				<input type="radio" name="tab" checked/>
				Users
			</label
			>
			<label class="tab btn toggle icon-btn" attendance-tab>
				<svg>
					<use xlink:href="assets/svg/shield-checkmark.svg#svg"></use>
				</svg>
				<input type="radio" name="tab" />
				Attendance
			</label>
			<label class="tab btn toggle icon-btn" user-access-tab>
				<svg>
					<use xlink:href="assets/svg/user-access.svg#svg"></use>
				</svg>
				<input type="radio" name="tab" />
				User Access
			</label>
		</div>
		<div class="users-search-container flex-row">
			<input
				class="users-search-input search-input floating"
				type="search"
				placeholder="Search"
				pattern="[a-zA-Z]{1,}"
				incremental />
			<button class="users-search-btn icon floating" title="Search Users">
				<svg>
					<use xlink:href="assets/svg/search.svg#svg"></use>
				</svg>
			</button>
			<button class="users-refresh-btn icon floating" title="Refresh Users">
				<svg>
					<use xlink:href="assets/svg/refresh.svg#svg"></use>
				</svg>
			</button>
		</div>
		<div class="attendance-search-container flex-row">
			<input
				class="attendance-search-input search-input floating"
				type="search"
				placeholder="Search"
				pattern="[a-zA-Z]{1,}"
				incremental />
			<button class="attendance-search-btn icon floating" title="Search Attendance">
				<svg>
					<use xlink:href="assets/svg/search.svg#svg"></use>
				</svg>
			</button>
			<button class="attendance-refresh-btn icon floating" title="Refresh Attendance">
				<svg>
					<use xlink:href="assets/svg/refresh.svg#svg"></use>
				</svg>
			</button>
		</div>
		<div class="user-access-spacing"></div>
		<label class="theme toggle btn" title="Toggle Theme">
			<input type="checkbox" class="theme-toggle-input" />
			<svg dark>
				<use xlink:href="assets/svg/theme-dark.svg#svg"></use>
			</svg>
			<svg light>
				<use xlink:href="assets/svg/theme-light.svg#svg"></use>
			</svg>
		</label>
		<button class="icon-btn">
			<svg>
				<use xlink:href="assets/svg/logout.svg#svg"></use>
			</svg>
			Logout
		</button>
		<div class="main-tab-container">
			<div class="main-tab users" autofocus>
				<div class="users-data-container">
					<table class="users-data">
						<thead>
							<tr>
								<th></th>
								<th>UID</th>
								<th dp>DP</th>
								<th>Username</th>
								<th>Surname</th>
								<th>Name</th>
								<th>Created</th>
								<th>Last Payment</th>
								<th>Account Expires</th>
								<th>Status</th>
								<th>Actions</th>
							</tr>
						</thead>
						<tbody></tbody>
					</table>
				</div>
				<table class="add-user">
					<tr>
						<th>UID</th>
						<th>Username</th>
						<th>Surname</th>
						<th>Name</th>
						<th>Account Expires</th>
						<th>Profile Picture</th>
						<th>Actions</th>
					</tr>
					<tr>
						<td class="uid">?</td>
						<td class="username">
							<input type="text" placeholder="Username" name="username" pattern="[a-z.]{3,20}"/>
						</td>
						<td class="surname"><input type="text" placeholder="Surname" name="surname" pattern="[A-zÀ-ž][A-zÀ-ž ]{3,20}"/></td>
						<td class="name"><input type="text" placeholder="Name" name="name" pattern="[A-zÀ-ž][A-zÀ-ž ]{3,20}"/></td>
						<td class="expires"><input type="month" name="expires"/></td>
						<td class="profile-picture-container">
							<label class="profile-picture toggle btn flex-row">
								<input
									type="file"
									accept="image/*"
									class="new-user-profile-picture-input" name="dp"/>
							</label>
						</td>
						<td class="actions-container">
							<button class="action icon-btn clear-btn">
								<svg>
									<use xlink:href="assets/svg/clear.svg#svg"></use>
								</svg>
								Clear
							</button>
							<button class="action icon-btn create-user-btn">
								<svg>
									<use xlink:href="assets/svg/create.svg#svg"></use>
								</svg>
								Create User
							</button>
						</td>
					</tr>
				</table>
			</div>
			<div class="main-tab attendance" tabindex="-1" >
				<table class="attendance-data">
					<thead>
						<tr>
							<th>Time</th>
							<th>UID</th>
							<th dp>DP</th>
							<th>Username</th>
							<th>Surname</th>
							<th>Name</th>
							<th>Account Expires</th>
						</tr>
					</thead>
					<tbody></tbody>
				</table>
			</div>
			<div class="main-tab user-access" tabindex="-1">
				<div class="uid-container flex-row">
					<input
						type="search"
						class="uid-input floating"
						placeholder="Place UID here" pattern="[0-9]{16}"/>
					<button class="icon floating uid-go-btn" title="Evaluate User Access">
						<svg>
							<use xlink:href="assets/svg/go.svg#svg"></use>
						</svg>
					</button>
					<i>or</i>
					<button class="icon-btn uid-read-clipboard-btn">
						<svg>
							<use xlink:href="assets/svg/clipboard.svg#svg"></use>
						</svg>
						Paste
					</button>
				</div>
				<div class="user-container flex-column"></div>
			</div>
		</div>
		<a class="footer"
			>Copyright &copy; 2022-2023 - Ariana's Muscle 4 Mula | Created & Designed
			by Ganesh W.</a
		>
	</body>
</html>
